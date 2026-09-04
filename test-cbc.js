const { SerialPort } = require('serialport');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

let latestCBC = null;
let latestCBCReceivedAt = null;

app.get('/cbc-status', (req, res) => {

    const activeState =
        activeCBCPort
            ? openPorts.get(activeCBCPort)
            : null;

    res.json({
        connected:
            !!(
                activeState &&
                activeState.port &&
                activeState.port.isOpen
            ),

        machine: 'Mindray BC-2800',

        port: activeCBCPort || null,

        waiting: !latestCBC,

        listeningPorts:
            Array.from(openPorts.keys())
    });
});

// Get latest CBC
app.get('/cbc-latest', (req, res) => {

    if (!latestCBC) {
        return res.json({
            success: false,
            waiting: true,
            message: 'Waiting for BC-2800 result...'
        });
    }

    res.json({
        success: true,
        waiting: false,
        receivedAt: latestCBCReceivedAt,
        result: latestCBC
    });
});

// Clear old CBC before waiting for a new patient
app.post('/cbc-clear', (req, res) => {

    latestCBC = null;
    latestCBCReceivedAt = null;

    console.log('🧹 Previous CBC cleared.');
    console.log('📡 Waiting for next BC-2800 result...');

    res.json({
        success: true
    });
});

app.listen(3000, () => {
    console.log('');
    console.log('🌐 BMC CBC Bridge running');
    console.log('http://127.0.0.1:3000');
    console.log('');
});
// ======================================================
// BIBO - BC-2800 AUTOMATIC COM PORT DETECTION
// ======================================================


const openPorts = new Map();

let activeCBCPort = null;


// ======================================================
// CHECK WHETHER PACKET LOOKS LIKE BC-2800 DATA
// ======================================================

function isBC2800Packet(packet) {

    if (!packet || packet.length < 90) {
        return false;
    }

    // Must begin with STX
    if (packet[0] !== 0x02) {
        return false;
    }

    // Must end with EOF
    if (packet[packet.length - 1] !== 0x1A) {
        return false;
    }

    const text = packet
        .subarray(1, packet.length - 1)
        .toString("ascii");


    // BC-2800 patient result records we have observed
    // begin with record type A.
    if (!text.startsWith("A")) {
        return false;
    }


    // Fixed CBC portion is at least 88 characters.
    if (text.length < 88) {
        return false;
    }


    return true;
}


// ======================================================
// OPEN ONE SERIAL PORT
// ======================================================

function connectToPort(path) {

    if (openPorts.has(path)) {
        return;
    }


    console.log(`🔎 Trying ${path}...`);


    const port = new SerialPort({

        path: path,

        baudRate: 9600,

        dataBits: 7,

        stopBits: 1,

        parity: "none",

        rtscts: false,

        xon: false,

        xoff: false,

        autoOpen: false

    });


    const state = {

        port: port,

        buffer: Buffer.alloc(0),

        path: path

    };


    openPorts.set(
        path,
        state
    );


    port.open(error => {

        if (error) {

            console.log(
                `⚠️ Could not open ${path}: ${error.message}`
            );

            openPorts.delete(path);

            return;
        }


        console.log(
            `✅ Listening on ${path}`
        );

    });


    // ==================================================
    // RECEIVE DATA
    // ==================================================

    port.on("data", chunk => {

        state.buffer =
            Buffer.concat([
                state.buffer,
                chunk
            ]);


        processPortBuffer(state);

    });


    // ==================================================
    // PORT ERROR
    // ==================================================

    port.on("error", error => {

        console.log(
            `⚠️ Serial error on ${path}:`,
            error.message
        );

    });


    // ==================================================
    // PORT CLOSED
    // ==================================================

    port.on("close", () => {

        console.log(
            `🔌 ${path} disconnected`
        );


        openPorts.delete(path);


        if (
            activeCBCPort === path
        ) {

            activeCBCPort = null;

            console.log(
                "📡 BC-2800 port lost. Searching again..."
            );

        }

    });

}


// ======================================================
// EXTRACT COMPLETE STX -> EOF PACKETS
// ======================================================

function processPortBuffer(state) {

    while (true) {

        // Find STX
        const stx =
            state.buffer.indexOf(0x02);


        if (stx === -1) {

            // Prevent rubbish data growing forever.
            if (state.buffer.length > 4096) {
                state.buffer = Buffer.alloc(0);
            }

            return;
        }


        // Remove anything before STX
        if (stx > 0) {

            state.buffer =
                state.buffer.subarray(stx);

        }


        // Find EOF after STX
        const eof =
            state.buffer.indexOf(
                0x1A,
                1
            );


        if (eof === -1) {
            return;
        }


        const packet =
            state.buffer.subarray(
                0,
                eof + 1
            );


        // Remove processed packet
        state.buffer =
            state.buffer.subarray(
                eof + 1
            );


        // ==================================================
        // VERIFY THIS IS BC-2800
        // ==================================================

        if (!isBC2800Packet(packet)) {

            console.log(
                `ℹ️ Ignoring non-BC-2800 data from ${state.path}`
            );

            continue;
        }


        // ==================================================
        // BC-2800 FOUND
        // ==================================================

        activeCBCPort =
            state.path;


        console.log("");
        console.log(
            "🩸 BC-2800 DETECTED"
        );

        console.log(
            `🔌 Active analyzer port: ${state.path}`
        );

        console.log(
            `📦 Packet size: ${packet.length} bytes`
        );


        // ==================================================
        // USE YOUR EXISTING DECODER
        // ==================================================

        try {

            decodeBC2800(packet);

        }

        catch (error) {

            console.error(
                "❌ BC-2800 DECODER ERROR:",
                error
            );

        }

    }
}


// ======================================================
// SCAN WINDOWS COM PORTS
// ======================================================

async function scanSerialPorts() {

    try {

        const ports =
            await SerialPort.list();


        const detectedPaths =
            new Set(
                ports.map(
                    port => port.path
                )
            );


        // ----------------------------------------------
        // Open newly discovered ports
        // ----------------------------------------------

        for (const info of ports) {

            if (!openPorts.has(info.path)) {

                console.log(
                    `🔎 Serial device found: ${info.path}`,
                    info.friendlyName ||
                    info.manufacturer ||
                    ""
                );


                connectToPort(
                    info.path
                );

            }

        }


        // ----------------------------------------------
        // Remove disconnected ports
        // ----------------------------------------------

        for (
            const [path, state]
            of openPorts.entries()
        ) {

            if (!detectedPaths.has(path)) {

                try {

                    if (state.port.isOpen) {

                        state.port.close();

                    }

                }

                catch (error) {

                    console.log(
                        `⚠️ Error closing ${path}:`,
                        error.message
                    );

                }


                openPorts.delete(path);

            }

        }


        if (ports.length === 0) {

            console.log(
                "⚠️ No COM ports detected."
            );

        }

    }

    catch (error) {

        console.error(
            "❌ COM port scan failed:",
            error
        );

    }

}


// ======================================================
// START AUTOMATIC DETECTION
// ======================================================

console.log("");
console.log("🏥 BIBO BC-2800 BRIDGE");
console.log(
    "📡 Searching automatically for BC-2800..."
);
console.log(
    "⚙️ Serial settings: 9600 baud / 7 data bits / no parity / 1 stop bit"
);
console.log("");


// Scan immediately
scanSerialPorts();


// Scan every 5 seconds
setInterval(
    scanSerialPorts,
    5000
);


function decodeBC2800(buffer) {

    let data = buffer
        .toString('ascii')
        .replace(/\x02/g, '')
        .replace(/\x1A/g, '');

    const start = data.indexOf('A');

    if (start === -1) {
        console.log('❌ BC-2800 packet header not found.');
        return;
    }

    data = data.substring(start);

    let p = 0;

    function take(length) {
        const value = data.substring(p, p + length);
        p += length;
        return value;
    }

    // ================================
    // HEADER
    // ================================

    const recordType = take(1);
    const sampleId = take(8);
    const unknownFlag = take(1);
    const dateRaw = take(8);
    const timeRaw = take(4);

    // ================================
    // CBC RESULT VALUES
    // ================================

    const raw = {
        WBC: take(4),

        LymphAbs: take(4),
        MidAbs: take(4),
        GranAbs: take(4),

        LymphPct: take(3),
        MidPct: take(3),
        GranPct: take(3),

        RBC: take(3),
        HGB: take(3),

        MCHC: take(4),
        MCV: take(4),
        MCH: take(4),

        RDW_CV: take(3),
        HCT: take(3),

        PLT: take(4),

        MPV: take(3),
        PDW: take(3),
        PCT: take(3),

        RDW_SD: take(4)
    };

    const result = {

        machine: 'Mindray BC-2800',

        sampleId: parseInt(sampleId, 10),

        date:
            dateRaw.substring(0, 2) + '-' +
            dateRaw.substring(2, 4) + '-' +
            dateRaw.substring(4, 8),

        time:
            timeRaw.substring(0, 2) + ':' +
            timeRaw.substring(2, 4),

        WBC: parseInt(raw.WBC, 10) / 10,

        LymphAbs: parseInt(raw.LymphAbs, 10) / 10,
        MidAbs: parseInt(raw.MidAbs, 10) / 10,
        GranAbs: parseInt(raw.GranAbs, 10) / 10,

        LymphPct: parseInt(raw.LymphPct, 10) / 10,
        MidPct: parseInt(raw.MidPct, 10) / 10,
        GranPct: parseInt(raw.GranPct, 10) / 10,

        RBC: parseInt(raw.RBC, 10) / 100,

        HGB: parseInt(raw.HGB, 10) / 10,

        MCHC: parseInt(raw.MCHC, 10) / 10,
        MCV: parseInt(raw.MCV, 10) / 10,
        MCH: parseInt(raw.MCH, 10) / 10,

        RDW_CV: parseInt(raw.RDW_CV, 10) / 10,
        HCT: parseInt(raw.HCT, 10) / 10,

        PLT: parseInt(raw.PLT, 10),

        MPV: parseInt(raw.MPV, 10) / 10,
        PDW: parseInt(raw.PDW, 10) / 10,
        PCT: parseInt(raw.PCT, 10) / 1000,

        RDW_SD: parseInt(raw.RDW_SD, 10) / 10
    };

    // ================================
    // HISTOGRAM DATA
    // ================================

    const remaining = data.substring(p);

    console.log('');
    console.log('Remaining chars:', remaining.length);

    if (remaining.length < 2364) {
        console.log('⚠️ Histogram packet appears incomplete.');
        console.log('Expected at least 2364 characters.');
        console.log('Received:', remaining.length);
        return;
    }
const graphHeader = remaining.substring(0, 60);
const graphData = remaining.substring(60, 2364);

let gp = 0;

function graphTake(length) {
    const value = graphHeader.substring(gp, gp + length);
    gp += length;
    return value;
}

const graphInfo = {
    reserved1: graphTake(15),

    Rm: graphTake(1),
    R1: graphTake(1),
    R2: graphTake(1),
    R3: graphTake(1),
    R4: graphTake(1),

    Pm: graphTake(1),
    Ps: graphTake(1),
    Pl: graphTake(1),

    L1: Number(graphTake(3)),
    L2: Number(graphTake(3)),
    L3: Number(graphTake(3)),
    L4: Number(graphTake(3)),
    L5: Number(graphTake(3)),
    L6: Number(graphTake(3)),
    L7: Number(graphTake(3)),
    L8: Number(graphTake(3)),

    reserved2: graphTake(16)
};

console.log("");
console.log("🔬 BC-2800 GRAPH / MORPHOLOGY INFO");
console.log(graphInfo);

result.graphInfo = graphInfo;



    
    function parseGraph(block) {

        const points = [];

        for (let i = 0; i < block.length; i += 3) {

            const chunk = block.substring(i, i + 3);

            const value = Number(chunk);

            if (Number.isFinite(value)) {
                points.push(value);
            }
        }

        return points;
    }

    const wbcBlock = graphData.substring(0, 768);
    const rbcBlock = graphData.substring(768, 1536);
    const pltBlock = graphData.substring(1536, 2304);

    const histograms = {

        WBC: parseGraph(wbcBlock),

        RBC: parseGraph(rbcBlock),

        PLT: parseGraph(pltBlock)
    };

    result.histograms = histograms;

    // ================================
    // DISPLAY CBC
    // ================================

    console.log('');
    console.log('========================================');
    console.log('🩸 BC-2800 CBC RESULT');
    console.log('========================================');

    console.log('Sample ID :', result.sampleId);
    console.log('Date      :', result.date);
    console.log('Time      :', result.time);

    console.log('');

    console.log('WBC       :', result.WBC);
    console.log('Lymph#    :', result.LymphAbs);
    console.log('Mid#      :', result.MidAbs);
    console.log('Gran#     :', result.GranAbs);

    console.log('Lymph%    :', result.LymphPct);
    console.log('Mid%      :', result.MidPct);
    console.log('Gran%     :', result.GranPct);

    console.log('');

    console.log('RBC       :', result.RBC);
    console.log('HGB       :', result.HGB);
    console.log('HCT       :', result.HCT);

    console.log('MCV       :', result.MCV);
    console.log('MCH       :', result.MCH);
    console.log('MCHC      :', result.MCHC);

    console.log('RDW-CV    :', result.RDW_CV);
    console.log('RDW-SD    :', result.RDW_SD);

    console.log('');

    console.log('PLT       :', result.PLT);
    console.log('MPV       :', result.MPV);
    console.log('PDW       :', result.PDW);
    console.log('PCT       :', result.PCT);

    // ================================
    // DISPLAY GRAPH INFO
    // ================================

    console.log('');
    console.log('========================================');
    console.log('📊 BC-2800 HISTOGRAMS');
    console.log('========================================');

    console.log('WBC points:', histograms.WBC.length);
    console.log('RBC points:', histograms.RBC.length);
    console.log('PLT points:', histograms.PLT.length);

    console.log('');

    console.log(
        'WBC first 20:',
        histograms.WBC.slice(0, 20).join(', ')
    );

    console.log(
        'RBC first 20:',
        histograms.RBC.slice(0, 20).join(', ')
    );

    console.log(
        'PLT first 20:',
        histograms.PLT.slice(0, 20).join(', ')
    );

    console.log('');
    console.log('========================================');

    // IMPORTANT:
    // Don't print entire histogram arrays here.
    // They contain 768 values total.

    const compactResult = {
        machine: result.machine,
        sampleId: result.sampleId,
        date: result.date,
        time: result.time,

        WBC: result.WBC,
        LymphAbs: result.LymphAbs,
        MidAbs: result.MidAbs,
        GranAbs: result.GranAbs,

        LymphPct: result.LymphPct,
        MidPct: result.MidPct,
        GranPct: result.GranPct,

        RBC: result.RBC,
        HGB: result.HGB,
        HCT: result.HCT,

        MCV: result.MCV,
        MCH: result.MCH,
        MCHC: result.MCHC,

        RDW_CV: result.RDW_CV,
        RDW_SD: result.RDW_SD,

        PLT: result.PLT,
        MPV: result.MPV,
        PDW: result.PDW,
        PCT: result.PCT,

        histogramPoints: {
            WBC: histograms.WBC.length,
            RBC: histograms.RBC.length,
            PLT: histograms.PLT.length
        }
    };

    console.log('\nJSON RESULT:');
    console.log(JSON.stringify(compactResult, null, 2));

// ========================================
// SAVE RESULT FOR KEAH
// ========================================

latestCBC = result;
latestCBCReceivedAt = new Date().toISOString();

console.log('');
console.log('✅ CBC RECEIVED AND READY FOR KEAH');
console.log('Sample:', result.sampleId);

return result;

}

