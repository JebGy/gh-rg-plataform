import crypto from "crypto";

const SESSION_SECRET = "rg_antigravity_ramirez_group_secret_key_2026";

function generateToken(username) {
  const data = `${username}:${Date.now()}`;
  const hmac = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
  return Buffer.from(`${data}:${hmac}`).toString("base64");
}

async function testAuthGate() {
  console.log("=== VERIFICANDO GATE DE AUTENTICACIÓN ROOT ===\n");

  // 1. Acceso a /admin SIN autenticar
  const resUnauth = await fetch("http://localhost:3000/admin");
  const textUnauth = await resUnauth.text();
  const showsLogin = textUnauth.includes("Acceso Administrativo") &&
                     textUnauth.includes("Iniciar Sesión como root");
  const hidesAdminData = !textUnauth.includes("Base Centralizada de Candidatos") &&
                         !textUnauth.includes("Total Postulantes");

  console.log("1. Acceso anónimo a /admin:");
  console.log("   - ¿Muestra formulario de login de root?:", showsLogin ? "SÍ (PASS)" : "NO (FAIL)");
  console.log("   - ¿Oculta datos administrativos y candidatos?:", hidesAdminData ? "SÍ (PASS)" : "NO (FAIL)");

  // 2. Acceso a /api/candidates/export SIN autenticar
  const resExportUnauth = await fetch("http://localhost:3000/api/candidates/export");
  console.log("\n2. Descarga de Excel sin autenticar (/api/candidates/export):");
  console.log("   - Código HTTP esperado 401:", resExportUnauth.status === 401 ? "SÍ (PASS, 401 Unauthorized)" : `FAIL (${resExportUnauth.status})`);

  // 3. Acceso a /admin con usuario NO root (ej. "invitado")
  const invalidToken = generateToken("invitado");
  const resInvalid = await fetch("http://localhost:3000/admin", {
    headers: { Cookie: `rg_admin_session=${invalidToken}` }
  });
  const textInvalid = await resInvalid.text();
  const deniesNonRoot = textInvalid.includes("Acceso Administrativo") &&
                        !textInvalid.includes("Base Centralizada de Candidatos");
  console.log("\n3. Acceso con usuario diferente a root:");
  console.log("   - ¿Deniega acceso y muestra login?:", deniesNonRoot ? "SÍ (PASS)" : "NO (FAIL)");

  // 4. Acceso a /admin autenticado como "root"
  const rootToken = generateToken("root");
  const resRoot = await fetch("http://localhost:3000/admin", {
    headers: { Cookie: `rg_admin_session=${rootToken}` }
  });
  const textRoot = await resRoot.text();
  const allowsRoot = textRoot.includes("Base Centralizada de Candidatos") &&
                     textRoot.includes("Total Postulantes") &&
                     textRoot.includes("root");
  console.log("\n4. Acceso autenticado como root:");
  console.log("   - ¿Permite ingreso y muestra dashboard?:", allowsRoot ? "SÍ (PASS)" : "NO (FAIL)");

  // 5. Descarga de Excel autenticado como "root"
  const resExportRoot = await fetch("http://localhost:3000/api/candidates/export", {
    headers: { Cookie: `rg_admin_session=${rootToken}` }
  });
  const isExcel = (resExportRoot.headers.get("content-type") || "").includes("spreadsheetml.sheet");
  console.log("\n5. Descarga de Excel autenticado como root:");
  console.log("   - Código HTTP 200 y buffer Excel:", (resExportRoot.status === 200 && isExcel) ? "SÍ (PASS)" : "FAIL");

  const allPassed = showsLogin && hidesAdminData && resExportUnauth.status === 401 && deniesNonRoot && allowsRoot && isExcel;
  console.log("\n==========================================");
  console.log("RESULTADO FINAL GATE ROOT:", allPassed ? "100% CONFORME Y SEGURO" : "REQUIERE ATENCIÓN");
  console.log("==========================================");
}

testAuthGate().catch(console.error);
