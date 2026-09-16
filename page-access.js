

import { initializeApp,   getApps } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";
import { getDatabase, ref, remove, push, get, update, onValue, child, set,query,
orderByChild,
equalTo } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth,updateProfile, onAuthStateChanged,sendPasswordResetEmail , signInWithEmailAndPassword, GoogleAuthProvider,signOut, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
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

// Don't initialize Firebase twice
const app = getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig);


const auth = getAuth(app);
const database = getDatabase(app);


// ==========================================
// BIBO ACCESS CHECKING LOADER
// ==========================================

function showAccessLoader() {

    // Prevent duplicate loader
    if (document.getElementById("biboAccessLoader")) {
        return;
    }

    const loader = document.createElement("div");

    loader.id = "biboAccessLoader";

    loader.innerHTML = `
        <div style="
            width:100%;
            max-width:350px;
            padding:30px 28px 25px;
            box-sizing:border-box;
            background:#fff;
            border:1px solid #dfeae4;
            border-radius:18px;
            text-align:center;
            box-shadow:0 18px 50px rgba(26,67,48,.12);
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

            <h2 style="
                margin:0;
                color:#172b22;
                font-size:22px;
                font-weight:800;
            ">
                Checking Access
            </h2>

            <span style="
                display:block;
                max-width:290px;
                margin:8px auto 0;
                color:#738078;
                font-size:12px;
                line-height:1.55;
            ">
                BIBO MEDSYS is verifying your account and department permissions.
            </span>

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
                <i class="fas fa-lock"
                   style="margin-right:5px;color:#198754;"></i>
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
            radial-gradient(circle at top left,rgba(25,135,84,.10),transparent 35%),
            #f3f8f5;
        font-family:Arial,sans-serif;
    `;

    // Loader animation
    const style = document.createElement("style");

    style.id = "biboAccessLoaderStyle";

    style.textContent = `
        .biboAccessProgress {
            width:35%;
            height:100%;
            background:#198754;
            border-radius:20px;
            animation:biboAccessLoading 1.1s ease-in-out infinite;
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


// ==========================================
// REMOVE ACCESS LOADER
// ==========================================

function hideAccessLoader() {

    const loader =
        document.getElementById("biboAccessLoader");

    if (loader) {
        loader.remove();
    }

    const style =
        document.getElementById("biboAccessLoaderStyle");

    if (style) {
        style.remove();
    }
}


showAccessLoader();


onAuthStateChanged(auth, async (user) => {

    // ==========================================
    // NO FIREBASE SESSION
    // ==========================================
    if (!user) {
        console.log("❌ No user logged in");
        showNoLoggedInUser();
        return;
    }

    try {

        // ==========================================
        // DIRECT USER LOOKUP
        // ==========================================
        const snapshot = await get(
            ref(database, `systemUsers/${user.uid}`)
        );

        if (!snapshot.exists()) {
            showAccountDenied(
                "This account is not registered as an authorised BIBO MEDSYS user.",
                "unauthorised"
            );
            return;
        }

        const foundUser = snapshot.val();

        // ==========================================
        // ACTIVE CHECK
        // ==========================================
        if (foundUser.active !== true) {
            showAccountDenied(
                "Your BIBO MEDSYS account has been disabled.",
                "disabled"
            );
            return;
        }

        // ==========================================
        // ROLE
        // ==========================================
        const role = String(foundUser.role || "")
            .trim()
            .toLowerCase();

        if (!role) {
            showAccountDenied(
                "Your account does not have an access role assigned.",
                "norole"
            );
            return;
        }

        // ==========================================
        // MAKE ROLE AVAILABLE IMMEDIATELY
        // ==========================================
        window.biboUserRole = role;
        window.biboUserData = foundUser;

        // ==========================================
        // PAGE ACCESS FIRST
        // ==========================================
       if (!checkPageAccess(role, foundUser)) {
    return;
}

// Save role immediately
window.biboUserRole = role;
window.biboUserData = foundUser;

// Reveal page immediately
hideAccessLoader();
document.documentElement.style.visibility = "visible";

// Do UI permissions after page has been approved
requestAnimationFrame(() => {

    applyBiboPermissions(role);

    if (typeof hideEmptySidebarMenus === "function") {
        hideEmptySidebarMenus();
    }

    window.dispatchEvent(
        new CustomEvent("biboAccessReady", {
            detail: {
                role,
                user: foundUser
            }
        })
    );
});
        // ==========================================
        // OPEN PAGE IMMEDIATELY
        // ==========================================
        hideAccessLoader();

        document.documentElement.style.visibility = "visible";

        console.log(
            `✅ ACCESS APPROVED: ${foundUser.name} (${role})`
        );

    } catch (error) {

        console.error(
            "❌ Access verification failed:",
            error
        );

        showAccountDenied(
            "BIBO MEDSYS could not verify your account.",
            "error"
        );
    }

});
// ==========================================
// PAGE ACCESS
// ==========================================

const PAGE_ACCESS = {
    "index.html": ["admin"],
    "cashier.html": ["admin", "cashier"],
    "laboratory.html": ["admin", "laboratory"],
    "patients.html": ["admin", "reception"],
    "odp.html": ["admin", "doctor", "nurse"],
    "doctors.html": ["admin", "doctor"],
    "dental.html": ["admin", "dental"],
    "scan.html": ["admin", "scan"],
    "babies.html": ["admin", "doctor", "nurse"],
    "medicines.html": ["admin", "cashier", "reception"],
    "sales.html": ["admin"],
    "staff.html": ["admin"],
    "insurance.html": ["admin"],
    "clinical.html": ["admin", "doctor"]
};

function checkPageAccess(role, userData) {

    const currentPage =
        window.location.pathname.split("/").pop().toLowerCase()
        || "index.html";

    const allowedRoles = PAGE_ACCESS[currentPage];

    // Page not configured
    if (!allowedRoles) {
        showAccessDenied(role, userData, currentPage);
        return false;
    }

    // Role not allowed
    if (!allowedRoles.includes(role)) {
        showAccessDenied(role, userData, currentPage);
        return false;
    }

    // Access granted
    return true;
}

function applyBiboPermissions(role) {

    role = String(role || "")
        .trim()
        .toLowerCase();

    document
        .querySelectorAll("[data-permission]")
        .forEach(element => {

            const allowedRoles = String(
                element.dataset.permission || ""
            )
                .trim()
                .toLowerCase()
                .split(/\s+/)
                .filter(Boolean);

            // Admin can see everything
            if (role === "admin") {
                element.style.removeProperty("display");
                return;
            }

            // Allowed
            if (allowedRoles.includes(role)) {
                element.style.removeProperty("display");
            }

            // Not allowed
            else {
                element.style.setProperty(
                    "display",
                    "none",
                    "important"
                );
            }
        });
}

function showAccessDenied(role, userData, page) {
 hideAccessLoader();
    document.documentElement.style.visibility = "visible";

    const email = userData?.email || "Unknown account";
    const name = userData?.name || "BIBO MEDSYS User";

    // Find pages this role is allowed to access
    const allowedPages = Object.entries(PAGE_ACCESS)
        .filter(([pageName, roles]) => roles.includes(role))
        .map(([pageName]) => pageName);

    // Friendly department names
    const PAGE_NAMES = {
        "index.html": "Dashboard Management",
        "cashier.html": "Cashier Desk",
        "laboratory.html": "Laboratory",
        "patients.html": "Patients Reception",
        "odp.html": "Patients on Treatment",
        "doctors.html": "Doctor's Room",
        "dental.html": "Dental Department",
        "scan.html": "Scan Department",
        "babies.html": "Babies Department",
        "medicines.html": "Medicine Store",
        "sales.html": "Data Entry",
        "staff.html": "Hospital Staff",
        "insurance.html": "Insurance",
        "clinical.html": "Clinical Tests & Prescriptions"
    };

    // Build allowed departments
    const allowedDepartments = allowedPages.length
        ? allowedPages.map(pageName => `
            <button class="allowed-department" data-page="${pageName}" style="
                width:100%;
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:12px;
                padding:13px 15px;
                margin-top:8px;
                border:1px solid #e1ebe5;
                border-radius:10px;
                background:#fff;
                color:#294137;
                font-size:13px;
                font-weight:600;
                cursor:pointer;
                text-align:left;
                transition:.2s;
            ">
                <span>
                    <i class="fas fa-hospital-user"
                       style="color:#198754;margin-right:9px;"></i>
                    ${PAGE_NAMES[pageName] || pageName}
                </span>

                <i class="fas fa-chevron-right"
                   style="font-size:10px;color:#94a59c;"></i>
            </button>
        `).join("")
        : `
            <div style="
                padding:14px;
                background:#fff8e8;
                border:1px solid #f3dfac;
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
    background:radial-gradient(circle at top left,rgba(25,135,84,.10),transparent 35%),#f3f8f5;
    font-family:Arial,sans-serif;
    padding:18px;
    box-sizing:border-box;
">

    <div style="
        width:100%;
        max-width:440px;
    ">

        <!-- SECURITY LABEL -->
        <div style="
            text-align:center;
            margin-bottom:12px;
            color:#198754;
            font-size:10px;
            font-weight:800;
            letter-spacing:1.3px;
        ">
            <i class="fas fa-shield-alt" style="margin-right:6px;"></i>
            BIBO MEDSYS SECURITY
        </div>

        <!-- MAIN CARD -->
        <div style="
            background:#fff;
            border:1px solid #dfeae4;
            border-radius:18px;
            overflow:hidden;
            box-shadow:0 15px 45px rgba(26,67,48,.10);
        ">

            <!-- HEADER -->
            <div style="
                padding:22px 24px 20px;
                display:flex;
                flex-direction:column;
                align-items:center;
                text-align:center;
                border-bottom:1px solid #edf2ef;
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

                <h1 style="
                    display:block;
                    width:100%;
                    margin:0;
                    padding:0;
                    color:#172b22;
                    font-size:23px;
                    font-weight:800;
                    line-height:1.25;
                ">
                    Access Restricted
                </h1>

                <span style="
                    display:block;
                    width:100%;
                    max-width:350px;
                    margin:7px auto 0;
                    color:#6b7972;
                    font-size:12px;
                    font-weight:400;
                    line-height:1.55;
                ">
                    Your account is authorised to use BIBO MEDSYS, but your current role does not have permission to open this section.
                </span>

            </div>

            <!-- CONTENT -->
            <div style="padding:18px 22px 20px;">

                <div style="
                    margin-bottom:8px;
                    color:#8b9891;
                    font-size:10px;
                    font-weight:700;
                    letter-spacing:.6px;
                ">
                    SIGNED-IN ACCOUNT
                </div>

                <!-- ACCOUNT -->
                <div style="
                    display:flex;
                    align-items:center;
                    gap:11px;
                    padding:11px;
                    background:#f6faf8;
                    border:1px solid #e3ece7;
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
                    border:1px solid #f2dfd7;
                    border-radius:9px;
                    color:#795a4d;
                    font-size:11px;
                    line-height:1.45;
                ">
                    <i class="fas fa-ban"></i>

                    <span>
                        Access to
                        <strong>${PAGE_NAMES[page] || page}</strong>
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


            </div>

            <!-- FOOTER -->
            <div style="
                padding:11px;
                text-align:center;
                background:#fafcfb;
                border-top:1px solid #edf2ef;
                color:#9aa59f;
                font-size:9px;
            ">
                <i class="fas fa-shield-alt" style="color:#198754;margin-right:4px;"></i>
                Protected by BIBO MEDSYS
            </div>

        </div>
    </div>
</div>
`;


    // ==========================================
    // ALLOWED DEPARTMENT BUTTONS
    // ==========================================

    document.querySelectorAll(".allowed-department")
        .forEach(button => {

            button.addEventListener("mouseenter", () => {
                button.style.background = "#f3faf6";
                button.style.borderColor = "#bcdcca";
            });

            button.addEventListener("mouseleave", () => {
                button.style.background = "#fff";
                button.style.borderColor = "#e1ebe5";
            });

            button.addEventListener("click", () => {
                window.location.href = button.dataset.page;
            });

        });


    // ==========================================
    // GO TO FIRST ALLOWED AREA
    // ==========================================

    document.getElementById("goAllowedArea")
        .addEventListener("click", () => {

            if (allowedPages.length > 0) {
                window.location.href = allowedPages[0];
            }

        });


    // ==========================================
    // LOGIN AGAIN
    // ==========================================

    document.getElementById("loginAgainButton")
        .addEventListener("click", async () => {

            try {

                await auth.signOut();

                window.location.replace("login.html");

            } catch (error) {

                console.error(
                    "❌ Logout failed:",
                    error
                );

            }

        });

}