// ============================================================
// BIBO MEDSYS PAGE ACCESS SYSTEM
// ============================================================

import {
    initializeApp,
    getApps
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";

import {
    getDatabase,
    ref,
    get,
    goOnline,
    onValue
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyCi_hufIZTzsYtdPGQtvtmKmAkkrydmn_A",
    authDomain: "abbah-83a7b.firebaseapp.com",
    databaseURL: "https://abbah-83a7b-default-rtdb.firebaseio.com",
    projectId: "abbah-83a7b",
    storageBucket: "abbah-83a7b.appspot.com",
    messagingSenderId: "379729759051",
    appId: "1:379729759051:web:e75528d61b02d1e4f536ce",
    measurementId: "G-H41J2WMR6S"
};


// ============================================================
// INITIALIZE FIREBASE ONLY ONCE
// ============================================================

const app = getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
// Make sure Realtime Database is online
goOnline(database);

// ============================================================
// PAGE ACCESS CONFIGURATION
// ============================================================

const PAGE_ACCESS = {

    "index.html": [
        "admin"
    ],

    "cashier.html": [
        "admin",
        "cashier"
    ],

    "laboratory.html": [
        "admin",
        "laboratory"
    ],

    "patients.html": [
        "admin",
        "reception"
    ],

    "odp.html": [
        "admin",
        "doctor",
        "nurse"
    ],

    "doctors.html": [
        "admin",
        "doctor"
    ],

    "dental.html": [
        "admin",
        "dental"
    ],

    "scan.html": [
        "admin",
        "scan"
    ],

    "babies.html": [
        "admin",
        "doctor",
        "nurse"
    ],

    "medicines.html": [
        "admin",
        "cashier",
        "reception"
    ],

    "sales.html": [
        "admin"
    ],

    "staff.html": [
        "admin"
    ],

    "insurance.html": [
        "admin"
    ],

    "clinical.html": [
        "admin",
        "doctor"
    ]
};


// ============================================================
// FRIENDLY PAGE NAMES
// ============================================================

const PAGE_NAMES = {

    "index.html":
        "Dashboard Management",

    "cashier.html":
        "Cashier Desk",

    "laboratory.html":
        "Laboratory",

    "patients.html":
        "Patients Reception",

    "odp.html":
        "Patients on Treatment",

    "doctors.html":
        "Doctor's Room",

    "dental.html":
        "Dental Department",

    "scan.html":
        "Scan Department",

    "babies.html":
        "Babies Department",

    "medicines.html":
        "Medicine Store",

    "sales.html":
        "Data Entry",

    "staff.html":
        "Hospital Staff",

    "insurance.html":
        "Insurance",

    "clinical.html":
        "Clinical Tests & Prescriptions"
};


// ============================================================
// CACHE NAME
// ============================================================

const BIBO_CACHE_KEY =
    "biboAccess";


// ============================================================
// CURRENT USER GLOBALS
// ============================================================

window.biboUserRole = null;
window.biboUserData = null;


// ============================================================
// HIDE PAGE IMMEDIATELY
//
// IMPORTANT:
// Put page-access.js as early as possible in the page.
// ============================================================

document.documentElement.style.visibility =
    "hidden";


// ============================================================
// CURRENT PAGE
// ============================================================

function getCurrentBiboPage() {

    return (
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase()
        || "index.html"
    );
}


// ============================================================
// CHECK WHETHER ROLE CAN ACCESS PAGE
// ============================================================

function canRoleAccessPage(
    role,
    page
) {

    role = String(role || "")
        .trim()
        .toLowerCase();

    const allowedRoles =
        PAGE_ACCESS[page];

    return (
        Array.isArray(allowedRoles) &&
        allowedRoles.includes(role)
    );
}


// ============================================================
// ACCESS LOADER
// ============================================================

function showAccessLoader() {

    if (document.getElementById("biboAccessLoader")) {
        return;
    }

    document.documentElement.style.visibility = "visible";

    const loader = document.createElement("div");
    loader.id = "biboAccessLoader";

    loader.innerHTML = `

        <div style="
            width:100%;
            max-width:350px;
            padding:30px 28px 25px;
            box-sizing:border-box;

            background:rgba(255,255,255,.96);

            border:1px solid rgba(255,255,255,.65);
            border-radius:20px;

            text-align:center;

            box-shadow:
                0 28px 75px
                rgba(0,0,0,.28);

            backdrop-filter:blur(14px);
            -webkit-backdrop-filter:blur(14px);
        ">

            <div style="
                width:60px;
                height:60px;

                margin:0 auto 17px;

                display:flex;
                align-items:center;
                justify-content:center;

                background:#e8f6ee;

                border-radius:16px;

                color:#198754;

                font-size:24px;
            ">
                <i class="fas fa-shield-alt"></i>
            </div>


            <div style="
                width:100%;

                display:flex;
                flex-direction:column;

                align-items:center;
                justify-content:center;

                text-align:center;
            ">

                <h2 style="
                    display:block;
                    width:100%;

                    margin:0;
                    padding:0;

                    color:#172b22;

                    font-size:22px;
                    font-weight:800;
                    line-height:1.25;

                    text-align:center;
                ">
                    Checking Access
                </h2>

                <p style="
                    display:block;

                    width:100%;
                    max-width:290px;

                    margin:8px auto 0;
                    padding:0;

                    color:#738078;

                    font-size:12px;
                    font-weight:400;
                    line-height:1.55;

                    text-align:center;
                ">
                    BIBO MEDSYS is verifying your account and department permissions.
                </p>

            </div>


            <div style="
                width:100%;
                height:5px;

                margin:22px 0 17px;

                overflow:hidden;

                background:#e9f1ed;

                border-radius:20px;
            ">
                <div class="biboAccessProgress"></div>
            </div>


            <div style="
                color:#617068;
                font-size:11px;
            ">

                <i
                    class="fas fa-lock"
                    style="
                        margin-right:5px;
                        color:#198754;
                    "
                ></i>

                Verifying secure access...

            </div>


            <div style="
                margin-top:18px;

                color:#a0aaa5;

                font-size:9px;
                font-weight:700;

                letter-spacing:1px;
            ">
                BIBO MEDSYS SECURITY
            </div>

        </div>

    `;


    loader.style.cssText = `

        position:fixed;
        inset:0;

        z-index:9999999;

        display:flex;

        align-items:center;
        justify-content:center;

        padding:20px;

        box-sizing:border-box;

        background:
            linear-gradient(
                135deg,
                rgba(3,27,19,.74),
                rgba(7,74,48,.48)
            ),
            url("BMS 1 Logo Mockup Free PSD.png");

        background-size:cover;
        background-position:center;
        background-repeat:no-repeat;

        font-family:
            Arial,
            sans-serif;

    `;


    const style = document.createElement("style");

    style.id = "biboAccessLoaderStyle";

    style.textContent = `

        .biboAccessProgress {

            width:35%;
            height:100%;

            background:#198754;

            border-radius:20px;

            animation:
                biboAccessLoading
                1.1s
                ease-in-out
                infinite;
        }


        @keyframes biboAccessLoading {

            0% {
                transform:translateX(-120%);
            }

            100% {
                transform:translateX(320%);
            }

        }

    `;

    document.head.appendChild(style);
    document.body.appendChild(loader);
}

// ============================================================
// REMOVE ACCESS LOADER
// ============================================================

function hideAccessLoader() {

    const loader =
        document.getElementById(
            "biboAccessLoader"
        );


    if (loader) {
        loader.remove();
    }


    const style =
        document.getElementById(
            "biboAccessLoaderStyle"
        );


    if (style) {
        style.remove();
    }
}


// ============================================================
// READ CACHE
// ============================================================

function getCachedBiboAccess() {

    try {

        const raw =
            sessionStorage.getItem(
                BIBO_CACHE_KEY
            );


        if (!raw) {
            return null;
        }


        const cached =
            JSON.parse(raw);


        if (
            !cached ||
            cached.active !== true ||
            !cached.uid ||
            !cached.role
        ) {

            sessionStorage.removeItem(
                BIBO_CACHE_KEY
            );

            return null;
        }


        return cached;

    }

    catch (error) {

        console.warn(
            "⚠️ Invalid BIBO cache:",
            error
        );


        sessionStorage.removeItem(
            BIBO_CACHE_KEY
        );


        return null;
    }
}


// ============================================================
// SAVE CACHE
// ============================================================

function saveBiboAccess(
    firebaseUser,
    foundUser,
    role
) {

    const cachedUser = {

        uid:
            firebaseUser.uid,

        email:
            foundUser.email ||
            firebaseUser.email ||
            "",

        name:
            foundUser.name ||
            "BIBO MEDSYS User",

        role:
            role,

        active:
            true,

        verifiedAt:
            Date.now()
    };


    sessionStorage.setItem(
        BIBO_CACHE_KEY,
        JSON.stringify(cachedUser)
    );


    return cachedUser;
}


// ============================================================
// CLEAR ACCESS CACHE
// ============================================================

function clearBiboAccess() {

    sessionStorage.removeItem(
        BIBO_CACHE_KEY
    );


    window.biboUserRole =
        null;


    window.biboUserData =
        null;
}


// ============================================================
// ELEMENT PERMISSIONS
// ============================================================

function applyBiboPermissions(role) {

    role = String(role || "")
        .trim()
        .toLowerCase();


    const protectedElements =
        document.querySelectorAll(
            "[data-permission]"
        );


    protectedElements.forEach(
        element => {

            const allowedRoles =
                String(
                    element.dataset.permission ||
                    ""
                )
                    .trim()
                    .toLowerCase()
                    .split(/\s+/)
                    .filter(Boolean);


            // ADMIN SEES EVERYTHING
            if (role === "admin") {

                element.style.removeProperty(
                    "display"
                );

                return;
            }


            // ALLOWED
            if (
                allowedRoles.includes(role)
            ) {

                element.style.removeProperty(
                    "display"
                );

            }

            // DENIED
            else {

                element.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

            }

        }
    );
}


// ============================================================
// HIDE EMPTY SIDEBAR MENUS
// ============================================================

function hideEmptySidebarMenus() {

    const sidebarMenus =
        document.querySelectorAll(
            "#sidebar-menu .side-menu > li"
        );


    sidebarMenus.forEach(
        menu => {

            const childMenu =
                menu.querySelector(
                    ".child_menu"
                );


            if (!childMenu) {
                return;
            }


            const childItems =
                childMenu.querySelectorAll(
                    ":scope > li"
                );


            if (
                childItems.length === 0
            ) {
                return;
            }


            let hasVisibleItem =
                false;


            childItems.forEach(
                item => {

                    const style =
                        window.getComputedStyle(
                            item
                        );


                    if (
                        style.display !==
                        "none"
                    ) {

                        hasVisibleItem =
                            true;
                    }

                }
            );


            if (!hasVisibleItem) {

                menu.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

            }

            else {

                menu.style.removeProperty(
                    "display"
                );

            }

        }
    );
}


// ============================================================
// CHECK PAGE ACCESS
// ============================================================

function checkPageAccess(
    role,
    userData,
    showDenied = true
) {

    const page =
        getCurrentBiboPage();


    if (
        !canRoleAccessPage(
            role,
            page
        )
    ) {

        console.log(
            "❌ PAGE ACCESS DENIED:",
            role,
            page
        );


        if (showDenied) {

            showAccessDenied(
                role,
                userData,
                page
            );

        }


        return false;
    }


    return true;
}


// ============================================================
// APPROVE ACCESS
// ============================================================

function approveBiboAccess(
    role,
    userData,
    source = "firebase"
) {

    role = String(role || "")
        .trim()
        .toLowerCase();


    window.biboUserRole =
        role;


    window.biboUserData =
        userData;


    // PAGE CHECK
    if (
        !checkPageAccess(
            role,
            userData,
            true
        )
    ) {

        return false;
    }


    // ELEMENT PERMISSIONS
    applyBiboPermissions(role);


    // SIDEBAR
    hideEmptySidebarMenus();


    // REMOVE LOADER
    hideAccessLoader();


    // SHOW PAGE
    document.documentElement.style.visibility =
        "visible";


    // NOTIFY OTHER FILES
    window.dispatchEvent(
        new CustomEvent(
            "biboAccessReady",
            {
                detail: {
                    role: role,
                    user: userData,
                    source: source
                }
            }
        )
    );


    if (source === "cache") {

        console.log(
            "⚡ BIBO ACCESS APPROVED FROM CACHE"
        );

    }

    else {

        console.log(
            "✅ BIBO ACCESS VERIFIED BY FIREBASE"
        );

    }


    return true;
}


// ============================================================
// ACCESS DENIED SCREEN
// ============================================================

function showAccessDenied(role, userData, page) {

    hideAccessLoader();

    document.documentElement.style.visibility = "visible";

    const email =
        userData?.email ||
        "Unknown account";

    const name =
        userData?.name ||
        "BIBO MEDSYS User";


    const allowedPages =
        Object.entries(PAGE_ACCESS)
            .filter(
                ([pageName, roles]) =>
                    roles.includes(role)
            )
            .map(
                ([pageName]) =>
                    pageName
            );


    const allowedDepartments =
        allowedPages.length

            ? allowedPages
                .map(
                    pageName => `

                        <button
                            class="allowed-department"
                            data-page="${pageName}"

                            style="
                                width:100%;

                                display:flex;
                                align-items:center;
                                justify-content:space-between;

                                gap:12px;

                                padding:13px 15px;
                                margin-top:8px;

                                border:
                                    1px solid
                                    #e1ebe5;

                                border-radius:10px;

                                background:#fff;

                                color:#294137;

                                font-size:13px;
                                font-weight:600;

                                cursor:pointer;

                                text-align:left;

                                transition:.2s;
                            "
                        >

                            <span>

                                <i
                                    class="fas fa-hospital-user"

                                    style="
                                        color:#198754;
                                        margin-right:9px;
                                    "
                                ></i>

                                ${
                                    PAGE_NAMES[pageName] ||
                                    pageName
                                }

                            </span>


                            <i
                                class="fas fa-chevron-right"

                                style="
                                    font-size:10px;
                                    color:#94a59c;
                                "
                            ></i>

                        </button>

                    `
                )
                .join("")

            : `

                <div style="
                    padding:14px;

                    background:#fff8e8;

                    border:
                        1px solid
                        #f3dfac;

                    border-radius:10px;

                    color:#80651e;

                    font-size:12px;
                    line-height:1.5;
                ">
                    No department access has been assigned to this role.
                </div>

            `;


    document.body.innerHTML = `

        <div style="
            position:fixed;
            inset:0;

            z-index:999999;

            overflow:auto;

            display:flex;

            align-items:center;
            justify-content:center;

            padding:18px;

            box-sizing:border-box;

            background:
                linear-gradient(
                    135deg,
                    rgba(3,27,19,.74),
                    rgba(7,74,48,.48)
                ),
                url('BMS 1 Logo Mockup Free PSD.png');

            background-size:cover;
            background-position:center;
            background-repeat:no-repeat;

            font-family:
                Arial,
                sans-serif;
        ">


            <div style="
                width:100%;
                max-width:440px;
            ">


                <div style="
                    text-align:center;

                    margin-bottom:12px;

                    color:#fff;

                    font-size:10px;
                    font-weight:800;

                    letter-spacing:1.3px;

                    text-shadow:
                        0 2px 8px
                        rgba(0,0,0,.25);
                ">

                    <i
                        class="fas fa-shield-alt"
                        style="margin-right:6px;"
                    ></i>

                    BIBO MEDSYS SECURITY

                </div>


                <div style="
                    background:rgba(255,255,255,.96);

                    border:
                        1px solid
                        rgba(255,255,255,.65);

                    border-radius:18px;

                    overflow:hidden;

                    box-shadow:
                        0 28px 75px
                        rgba(0,0,0,.28);

                    backdrop-filter:blur(14px);
                    -webkit-backdrop-filter:blur(14px);
                ">


                    <!-- HEADER -->

                    <div style="
                        padding:
                            22px 24px 20px;

                        display:flex;

                        flex-direction:column;

                        align-items:center;

                        text-align:center;

                        border-bottom:
                            1px solid
                            #edf2ef;
                    ">


                        <div style="
                            width:58px;
                            height:58px;

                            flex:0 0 58px;

                            display:flex;

                            align-items:center;
                            justify-content:center;

                            margin-bottom:13px;

                            border-radius:16px;

                            background:#e8f6ee;

                            color:#198754;

                            font-size:23px;
                        ">

                            <i class="fas fa-lock"></i>

                        </div>


                        <div style="
                            width:100%;

                            display:flex;
                            flex-direction:column;

                            align-items:center;
                            justify-content:center;

                            text-align:center;
                        ">

                            <h1 style="
                                display:block;
                                width:100%;

                                margin:0;
                                padding:0;

                                color:#172b22;

                                font-size:23px;
                                font-weight:800;
                                line-height:1.25;

                                text-align:center;
                            ">
                                Access Restricted
                            </h1>


                            <p style="
                                display:block;

                                width:100%;
                                max-width:350px;

                                margin:7px auto 0;
                                padding:0;

                                color:#6b7972;

                                font-size:12px;
                                font-weight:400;
                                line-height:1.55;

                                text-align:center;
                            ">
                                Your account is authorised to use BIBO MEDSYS,
                                but your current role does not have permission
                                to open this section.
                            </p>

                        </div>

                    </div>


                    <!-- CONTENT -->

                    <div style="
                        padding:18px 22px 20px;
                    ">


                        <div style="
                            margin-bottom:8px;

                            color:#8b9891;

                            font-size:10px;
                            font-weight:700;

                            letter-spacing:.6px;
                        ">
                            SIGNED-IN ACCOUNT
                        </div>


                        <div style="
                            display:flex;

                            align-items:center;

                            gap:11px;

                            padding:11px;

                            background:#f6faf8;

                            border:
                                1px solid
                                #e3ece7;

                            border-radius:11px;
                        ">


                            <div style="
                                width:38px;
                                height:38px;

                                flex:0 0 38px;

                                display:flex;

                                align-items:center;
                                justify-content:center;

                                border-radius:10px;

                                background:#198754;

                                color:#fff;

                                font-size:14px;
                            ">

                                <i class="fas fa-user"></i>

                            </div>


                            <div style="
                                min-width:0;
                                flex:1;
                            ">

                                <strong style="
                                    display:block;

                                    margin-bottom:3px;

                                    color:#22382e;

                                    font-size:13px;
                                ">
                                    ${name}
                                </strong>


                                <div style="
                                    color:#718078;

                                    font-size:11px;

                                    overflow-wrap:anywhere;
                                ">
                                    ${email}
                                </div>

                            </div>


                            <span style="
                                padding:5px 8px;

                                background:#e5f5ec;

                                color:#198754;

                                border-radius:20px;

                                font-size:9px;
                                font-weight:800;

                                text-transform:uppercase;
                            ">
                                ${role}
                            </span>

                        </div>


                        <!-- BLOCKED PAGE -->

                        <div style="
                            margin-top:10px;

                            padding:10px 12px;

                            display:flex;

                            align-items:center;

                            gap:9px;

                            background:#fff8f5;

                            border:
                                1px solid
                                #f2dfd7;

                            border-radius:9px;

                            color:#795a4d;

                            font-size:11px;

                            line-height:1.45;
                        ">

                            <i class="fas fa-ban"></i>

                            <span>

                                Access to

                                <strong>
                                    ${
                                        PAGE_NAMES[page] ||
                                        page
                                    }
                                </strong>

                                is not available for your role.

                            </span>

                        </div>


                        <!-- ALLOWED AREAS -->

                        <div style="
                            margin-top:17px;
                            margin-bottom:7px;
                        ">

                            <div style="
                                color:#263b31;

                                font-size:13px;
                                font-weight:800;
                            ">
                                Your Allowed Access Areas
                            </div>

                            <div style="
                                margin-top:3px;

                                color:#839088;

                                font-size:10px;

                                line-height:1.4;
                            ">
                                Select a department below to continue.
                            </div>

                        </div>


                        <div id="allowedDepartments">
                            ${allowedDepartments}
                        </div>


                        <button
                            id="loginAgainButton"

                            style="
                                width:100%;

                                margin-top:15px;

                                padding:12px 15px;

                                border:
                                    1px solid
                                    #d8e6de;

                                border-radius:10px;

                                background:#fff;

                                color:#40554b;

                                font-size:12px;
                                font-weight:700;

                                cursor:pointer;
                            "
                        >

                            <i
                                class="fas fa-sign-in-alt"
                                style="margin-right:7px;"
                            ></i>

                            Login Again

                        </button>

                    </div>


                    <div style="
                        padding:11px;

                        text-align:center;

                        background:#fafcfb;

                        border-top:
                            1px solid
                            #edf2ef;

                        color:#9aa59f;

                        font-size:9px;
                    ">

                        <i
                            class="fas fa-shield-alt"

                            style="
                                color:#198754;
                                margin-right:4px;
                            "
                        ></i>

                        Protected by BIBO MEDSYS

                    </div>

                </div>

            </div>

        </div>

    `;


    document
        .querySelectorAll(".allowed-department")
        .forEach(button => {

            button.addEventListener(
                "mouseenter",
                () => {

                    button.style.background =
                        "#f3faf6";

                    button.style.borderColor =
                        "#bcdcca";
                }
            );


            button.addEventListener(
                "mouseleave",
                () => {

                    button.style.background =
                        "#fff";

                    button.style.borderColor =
                        "#e1ebe5";
                }
            );


            button.addEventListener(
                "click",
                () => {

                    window.location.href =
                        button.dataset.page;
                }
            );

        });


    const loginAgainButton =
        document.getElementById(
            "loginAgainButton"
        );


    if (loginAgainButton) {

        loginAgainButton.addEventListener(
            "click",

            async () => {

                try {

                    clearBiboAccess();

                    await signOut(auth);

                    window.location.replace(
                        "login.html"
                    );

                }

                catch (error) {

                    console.error(
                        "❌ Logout failed:",
                        error
                    );

                }

            }
        );

    }
}


// ============================================================
// ACCOUNT DENIED SCREEN
// ============================================================

function showAccountDenied(
    message,
    type = "unauthorised"
) {

    hideAccessLoader();

    document.documentElement.style.visibility =
        "visible";


    const firebaseUser =
        auth.currentUser;


    const email =
        firebaseUser?.email ||
        "No verified account";


    let title =
        "Access Not Authorised";


    let icon =
        "fa-user-lock";


    if (type === "disabled") {

        title =
            "Account Disabled";

        icon =
            "fa-user-slash";

    }

    else if (type === "norole") {

        title =
            "Access Role Missing";

        icon =
            "fa-user-cog";

    }

    else if (type === "error") {

        title =
            "Unable to Verify Account";

        icon =
            "fa-exclamation-triangle";

    }


    document.body.innerHTML = `

        <div style="
            position:fixed;
            inset:0;

            z-index:999999;

            display:flex;

            align-items:center;
            justify-content:center;

            padding:20px;

            box-sizing:border-box;

            background:
                linear-gradient(
                    135deg,
                    rgba(3,27,19,.74),
                    rgba(7,74,48,.48)
                ),
                url('BMS 1 Logo Mockup Free PSD.png');

            background-size:cover;
            background-position:center;
            background-repeat:no-repeat;

            font-family:
                Arial,
                sans-serif;
        ">


            <div style="
                width:100%;
                max-width:420px;
            ">


                <div style="
                    margin-bottom:12px;

                    text-align:center;

                    color:#fff;

                    font-size:10px;
                    font-weight:800;

                    letter-spacing:1.3px;

                    text-shadow:
                        0 2px 8px
                        rgba(0,0,0,.25);
                ">

                    <i
                        class="fas fa-shield-alt"
                        style="margin-right:6px;"
                    ></i>

                    BIBO MEDSYS SECURITY

                </div>


                <div style="
                    overflow:hidden;

                    background:rgba(255,255,255,.96);

                    border:
                        1px solid
                        rgba(255,255,255,.65);

                    border-radius:18px;

                    box-shadow:
                        0 28px 75px
                        rgba(0,0,0,.28);

                    backdrop-filter:blur(14px);
                    -webkit-backdrop-filter:blur(14px);
                ">


                    <div style="
                        padding:
                            27px 25px 22px;

                        display:flex;
                        flex-direction:column;

                        align-items:center;

                        text-align:center;

                        border-bottom:
                            1px solid
                            #edf2ef;
                    ">


                        <div style="
                            width:62px;
                            height:62px;

                            margin:
                                0 auto 15px;

                            display:flex;

                            align-items:center;
                            justify-content:center;

                            background:#e8f6ee;

                            border-radius:17px;

                            color:#198754;

                            font-size:25px;
                        ">

                            <i class="fas ${icon}"></i>

                        </div>


                        <div style="
                            width:100%;

                            display:flex;
                            flex-direction:column;

                            align-items:center;
                            justify-content:center;

                            text-align:center;
                        ">

                            <h1 style="
                                display:block;
                                width:100%;

                                margin:0;
                                padding:0;

                                color:#172b22;

                                font-size:23px;
                                font-weight:800;
                                line-height:1.25;

                                text-align:center;
                            ">
                                ${title}
                            </h1>


                            <p style="
                                display:block;

                                width:100%;
                                max-width:350px;

                                margin:8px auto 0;
                                padding:0;

                                color:#6b7972;

                                font-size:12px;
                                font-weight:400;
                                line-height:1.6;

                                text-align:center;
                            ">
                                ${message}
                            </p>

                        </div>

                    </div>


                    <div style="
                        padding:20px 22px;
                    ">


                        <div style="
                            margin-bottom:7px;

                            color:#8b9891;

                            font-size:10px;
                            font-weight:700;

                            letter-spacing:.6px;
                        ">
                            SIGNED-IN FIREBASE ACCOUNT
                        </div>


                        <div style="
                            padding:13px;

                            background:#f6faf8;

                            border:
                                1px solid
                                #e3ece7;

                            border-radius:10px;

                            color:#33483e;

                            font-size:12px;

                            overflow-wrap:anywhere;
                        ">

                            <i
                                class="fas fa-envelope"

                                style="
                                    color:#198754;
                                    margin-right:7px;
                                "
                            ></i>

                            ${email}

                        </div>


                        <button
                            id="deniedLoginAgainButton"

                            style="
                                width:100%;

                                margin-top:15px;

                                padding:13px;

                                border:0;

                                border-radius:10px;

                                background:#198754;

                                color:#fff;

                                font-size:12px;
                                font-weight:700;

                                cursor:pointer;
                            "
                        >

                            <i
                                class="fas fa-sign-in-alt"

                                style="
                                    margin-right:7px;
                                "
                            ></i>

                            Login Again

                        </button>

                    </div>


                    <div style="
                        padding:11px;

                        text-align:center;

                        background:#fafcfb;

                        border-top:
                            1px solid
                            #edf2ef;

                        color:#9aa59f;

                        font-size:9px;
                    ">

                        <i
                            class="fas fa-shield-alt"

                            style="
                                color:#198754;
                                margin-right:4px;
                            "
                        ></i>

                        Protected by BIBO MEDSYS

                    </div>

                </div>

            </div>

        </div>

    `;


    const button =
        document.getElementById(
            "deniedLoginAgainButton"
        );


    if (button) {

        button.addEventListener(
            "click",

            async () => {

                try {

                    clearBiboAccess();

                    await signOut(auth);

                    window.location.replace(
                        "login.html"
                    );

                }

                catch (error) {

                    console.error(
                        "❌ Logout failed:",
                        error
                    );

                }

            }
        );

    }
}

// ============================================================
// NO LOGGED-IN USER
// ============================================================

function showNoLoggedInUser() {

    hideAccessLoader();

    document.documentElement.style.visibility =
        "visible";


    document.body.innerHTML = `

        <div style="
            position:fixed;
            inset:0;

            z-index:999999;

            display:flex;

            align-items:center;
            justify-content:center;

            padding:20px;

            box-sizing:border-box;

            background:
                linear-gradient(
                    135deg,
                    rgba(3,27,19,.74),
                    rgba(7,74,48,.48)
                ),
                url('BMS 1 Logo Mockup Free PSD.png');

            background-size:cover;
            background-position:center;
            background-repeat:no-repeat;

            font-family:
                Arial,
                sans-serif;
        ">


            <div style="
                width:100%;
                max-width:390px;

                padding:30px 26px;

                box-sizing:border-box;

                background:rgba(255,255,255,.96);

                border:
                    1px solid
                    rgba(255,255,255,.65);

                border-radius:18px;

                text-align:center;

                box-shadow:
                    0 28px 75px
                    rgba(0,0,0,.28);

                backdrop-filter:blur(14px);
                -webkit-backdrop-filter:blur(14px);
            ">


                <div style="
                    width:62px;
                    height:62px;

                    margin:
                        0 auto 15px;

                    display:flex;

                    align-items:center;
                    justify-content:center;

                    background:#e8f6ee;

                    border-radius:17px;

                    color:#198754;

                    font-size:25px;
                ">

                    <i class="fas fa-user-lock"></i>

                </div>


                <div style="
                    width:100%;

                    display:flex;
                    flex-direction:column;

                    align-items:center;
                    justify-content:center;

                    text-align:center;
                ">

                    <h1 style="
                        display:block;
                        width:100%;

                        margin:0;
                        padding:0;

                        color:#172b22;

                        font-size:23px;
                        font-weight:800;
                        line-height:1.25;

                        text-align:center;
                    ">
                        Login Required
                    </h1>


                    <p style="
                        display:block;

                        width:100%;
                        max-width:330px;

                        margin:8px auto 20px;
                        padding:0;

                        color:#6b7972;

                        font-size:12px;
                        font-weight:400;
                        line-height:1.6;

                        text-align:center;
                    ">
                        No logged-in BIBO MEDSYS user was found.
                        Please sign in to continue.
                    </p>

                </div>


                <button
                    id="goToLoginButton"

                    style="
                        width:100%;

                        padding:13px;

                        border:0;

                        border-radius:10px;

                        background:#198754;

                        color:#fff;

                        font-size:12px;
                        font-weight:700;

                        cursor:pointer;
                    "
                >

                    <i
                        class="fas fa-sign-in-alt"

                        style="
                            margin-right:7px;
                        "
                    ></i>

                    Go to Login

                </button>


                <div style="
                    margin-top:18px;

                    color:#9aa59f;

                    font-size:9px;

                    font-weight:700;

                    letter-spacing:1px;
                ">

                    <i
                        class="fas fa-shield-alt"

                        style="
                            color:#198754;
                            margin-right:4px;
                        "
                    ></i>

                    BIBO MEDSYS SECURITY

                </div>

            </div>

        </div>

    `;


    const button =
        document.getElementById(
            "goToLoginButton"
        );


    if (button) {

        button.addEventListener(
            "click",
            () => {

                window.location.replace(
                    "login.html"
                );

            }
        );

    }
}


// ============================================================
// FAST CACHE STARTUP
// ============================================================
const cachedBiboUser =
    getCachedBiboAccess();

const currentBiboPage =
    getCurrentBiboPage();


if (
    cachedBiboUser &&
    cachedBiboUser.active === true &&
    cachedBiboUser.role
) {

    const role = String(
        cachedBiboUser.role
    )
        .trim()
        .toLowerCase();


    // ==========================================
    // CHECK PAGE BEFORE SHOWING IT
    // ==========================================

    if (
        canRoleAccessPage(
            role,
            currentBiboPage
        )
    ) {

        console.log(
            "⚡ Cached access allowed:",
            role,
            "→",
            currentBiboPage
        );

        approveBiboAccess(
            role,
            cachedBiboUser,
            "cache"
        );

    }

    else {

        console.log(
            "⛔ Cached access restricted:",
            role,
            "→",
            currentBiboPage
        );

        showAccessDenied(
            role,
            cachedBiboUser,
            currentBiboPage
        );

    }

}

else {

    // No previous verified session.
    // Wait for Firebase verification.

    if (document.body) {

        showAccessLoader();

    }

    else {

        document.addEventListener(
            "DOMContentLoaded",
            showAccessLoader,
            {
                once: true
            }
        );

    }

}
// ============================================================
// FIREBASE REVALIDATION
// ============================================================

// ============================================================
// FAST FIREBASE ACCESS VERIFICATION
// ============================================================

// ============================================================
// SIMPLE BIBO USER VERIFICATION
// ============================================================

// ============================================================
// BIBO ACCESS VERIFICATION WITH OFFLINE AUTO-RETRY
// ============================================================

let biboAccessVerified = false;
let biboRetryTimer = null;
let biboRetryCount = 0;


// ============================================================
// RETRY SETTINGS
// ============================================================

const BIBO_RETRY_DELAY = 1000; // retry every 1 second


// ============================================================
// START AUTH CHECK
// ============================================================

onAuthStateChanged(auth, (user) => {

    // ==========================================
    // NO USER LOGGED IN
    // ==========================================

    if (!user) {

        console.log("❌ No logged-in user");

        biboAccessVerified = false;

        clearTimeout(biboRetryTimer);

        sessionStorage.removeItem(
            "biboAccess"
        );

        hideAccessLoader();

        showNoLoggedInUser();

        return;
    }


    console.log("================================");
    console.log("👤 FIREBASE USER");
    console.log("Email:", user.email);
    console.log("UID:", user.uid);
    console.log("================================");


    // ==========================================
    // START VERIFICATION
    // ==========================================

    verifyBiboUser(user);

});


// ============================================================
// VERIFY USER
// ============================================================

function verifyBiboUser(user) {

    // Already successfully verified
    if (biboAccessVerified) {
        return;
    }


    // Prevent old scheduled retry
    clearTimeout(biboRetryTimer);


    const userPath =
        `systemUsers/${user.uid}`;


    const userRef =
        ref(
            database,
            userPath
        );


    console.log(
        "🔎 Checking:",
        userPath
    );


    onValue(

        userRef,


        // ====================================================
        // SUCCESSFUL DATABASE READ
        // ====================================================

        (snapshot) => {

            console.log(
                "✅ User access record received"
            );


            // Stop retry system
            clearTimeout(
                biboRetryTimer
            );


            biboRetryCount = 0;


            // =================================================
            // USER DOES NOT EXIST
            // =================================================

            if (!snapshot.exists()) {

                console.log(
                    "❌ User not registered"
                );


                biboAccessVerified =
                    false;


                sessionStorage.removeItem(
                    "biboAccess"
                );


                hideAccessLoader();


                showAccountDenied(
                    "This account is not registered as an authorised BIBO MEDSYS user.",
                    "unauthorised"
                );


                return;
            }


            // =================================================
            // GET USER DATA
            // =================================================

            const foundUser =
                snapshot.val();


            console.log(
                "👤 USER:",
                foundUser
            );


            // =================================================
            // ACCOUNT DISABLED
            // =================================================

            if (
                foundUser.active !== true
            ) {

                console.log(
                    "❌ Account disabled"
                );


                biboAccessVerified =
                    false;


                sessionStorage.removeItem(
                    "biboAccess"
                );


                hideAccessLoader();


                showAccountDenied(
                    "Your BIBO MEDSYS account has been disabled by the administrator.",
                    "disabled"
                );


                return;
            }


            // =================================================
            // GET ROLE
            // =================================================

            const role =
                String(
                    foundUser.role || ""
                )
                    .trim()
                    .toLowerCase();


            if (!role) {

                console.log(
                    "❌ No role assigned"
                );


                biboAccessVerified =
                    false;


                sessionStorage.removeItem(
                    "biboAccess"
                );


                hideAccessLoader();


                showAccountDenied(
                    "No access role has been assigned to this account.",
                    "norole"
                );


                return;
            }


            // =================================================
            // VERIFICATION SUCCESSFUL
            // =================================================

            biboAccessVerified =
                true;


            console.log("================================");
            console.log("✅ BIBO USER VERIFIED");
            console.log("Name:", foundUser.name);
            console.log("Email:", foundUser.email);
            console.log("Role:", role);
            console.log("================================");


            // =================================================
            // GLOBAL USER
            // =================================================

            window.biboUserRole =
                role;


            window.biboUserData =
                foundUser;


            // =================================================
            // SAVE SESSION
            // =================================================

            sessionStorage.setItem(

                "biboAccess",

                JSON.stringify({

                    uid:
                        user.uid,

                    email:
                        foundUser.email ||
                        user.email ||
                        "",

                    name:
                        foundUser.name ||
                        "BIBO User",

                    role:
                        role,

                    active:
                        true

                })

            );


            // =================================================
            // CHECK PAGE ACCESS
            // =================================================

            const allowed =
                checkPageAccess(
                    role,
                    foundUser
                );


            // Restricted page
            if (!allowed) {

                // checkPageAccess()
                // already shows Access Restricted

                return;
            }


            // =================================================
            // APPLY ELEMENT PERMISSIONS
            // =================================================

            applyBiboPermissions(
                role
            );


            if (
                typeof hideEmptySidebarMenus ===
                "function"
            ) {

                hideEmptySidebarMenus();

            }


            // =================================================
            // ACCESS COMPLETE
            // =================================================

            hideAccessLoader();


            document.documentElement.style.visibility =
                "visible";


            // =================================================
            // NOTIFY OTHER JS FILES
            // =================================================

            window.dispatchEvent(

                new CustomEvent(

                    "biboAccessReady",

                    {

                        detail: {

                            role:
                                role,

                            user:
                                foundUser

                        }

                    }

                )

            );


            console.log(
                "🚀 PAGE ACCESS COMPLETE"
            );

        },


        // ====================================================
        // DATABASE ERROR
        // ====================================================

        (error) => {

            console.error(
                "❌ Database access error:",
                error
            );


            const errorMessage =
                String(
                    error?.message || ""
                )
                    .trim()
                    .toLowerCase();


            // =================================================
            // FIREBASE CLIENT OFFLINE
            // =================================================

            if (
                errorMessage.includes(
                    "offline"
                )
            ) {

                biboRetryCount++;


                console.warn(
                    `📡 Firebase offline. Retry ${biboRetryCount}...`
                );


                // Keep access loader showing
                showAccessLoader();


                // Update loader message
                updateAccessLoaderForRetry(
                    biboRetryCount
                );


                // Retry after 1 second
                biboRetryTimer =
                    setTimeout(
                        () => {

                            verifyBiboUser(
                                user
                            );

                        },

                        BIBO_RETRY_DELAY
                    );


                return;
            }


            // =================================================
            // OTHER FIREBASE ERROR
            // =================================================

            clearTimeout(
                biboRetryTimer
            );


            hideAccessLoader();


            console.error(
                "❌ Non-offline Firebase error"
            );

            console.error(
                "Code:",
                error?.code
            );

            console.error(
                "Message:",
                error?.message
            );


            showAccountDenied(
                `BIBO MEDSYS could not verify your account. ${error?.message || ""}`,
                "error"
            );

        },


        // ====================================================
        // READ ONCE
        // ====================================================

        {
            onlyOnce: true
        }

    );

}


// ============================================================
// UPDATE LOADER WHILE RETRYING
// ============================================================

function updateAccessLoaderForRetry(
    attempt
) {

    const loader =
        document.getElementById(
            "biboAccessLoader"
        );


    if (!loader) {
        return;
    }


    // Find loader heading
    const heading =
        loader.querySelector("h2");


    if (heading) {

        heading.textContent =
            "Connecting to BIBO MEDSYS";

    }


    // Find description
    const description =
        heading?.nextElementSibling;


    if (description) {

        description.innerHTML = `

            The access server is temporarily unavailable.
            BIBO MEDSYS is reconnecting automatically.

            <br><br>

            <strong style="
                color:#198754;
            ">
                Retry attempt ${attempt}
            </strong>

        `;

    }

}

// ============================================================
// OPTIONAL GLOBAL HELPERS
//
// Useful from medicines.js, patients.js etc.
// ============================================================

window.getBiboRole =
    function () {

        return (
            window.biboUserRole ||
            getCachedBiboAccess()?.role ||
            ""
        );

    };


window.isBiboAdmin =
    function () {

        return (
            window.getBiboRole() ===
            "admin"
        );

    };


window.getBiboUser =
    function () {

        return (
            window.biboUserData ||
            getCachedBiboAccess()
        );

    };