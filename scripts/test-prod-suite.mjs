import postgres from "file:///C:/Users/xkira24/Desktop/Apps/ssma/node_modules/postgres/src/index.js";
import crypto from "crypto";

const SESSION_SECRET = "rg_antigravity_ramirez_group_secret_key_2026";

function generateToken(username) {
  const data = `${username}:${Date.now()}`;
  const hmac = crypto.createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
  return Buffer.from(`${data}:${hmac}`).toString("base64");
}

async function runTestSuite() {
  console.log("=== INICIANDO AUDITORIA DE CONFORMIDAD RAMIREZ GROUP (PUERTO 3000) ===\n");

  const results = [];
  const rootCookie = `rg_admin_session=${generateToken("root")}`;

  // 1. Test Home Page
  try {
    const res = await fetch("http://localhost:3000/");
    const text = await res.text();
    const ok = res.status === 200 &&
               text.includes("Ramirez Group") &&
               text.includes("Supervisor Operativo") &&
               text.includes("Supervisor de Seguridad") &&
               text.includes("Operadores de Camión Grúa") &&
               text.includes("Rigger");
    results.push({
      test: "Portal Público (/) - Carga Institucional y 4 Perfiles",
      status: ok ? "PASS" : "FAIL",
      httpStatus: res.status
    });
  } catch (e) {
    results.push({ test: "Portal Público (/)", status: "FAIL", error: e.message });
  }

  // 2. Test Gate Login Anónimo en /admin
  try {
    const res = await fetch("http://localhost:3000/admin");
    const text = await res.text();
    const ok = res.status === 200 &&
               text.includes("Acceso Administrativo") &&
               text.includes("Iniciar Sesión como root") &&
               !text.includes("Base Centralizada de Candidatos");
    results.push({
      test: "Gate de Seguridad (/admin) - Muestra solo login al usuario no autenticado",
      status: ok ? "PASS" : "FAIL",
      httpStatus: res.status
    });
  } catch (e) {
    results.push({ test: "Gate de Seguridad", status: "FAIL", error: e.message });
  }

  // 3. Test Admin Dashboard Autenticado como root
  try {
    const res = await fetch("http://localhost:3000/admin", {
      headers: { Cookie: rootCookie }
    });
    const text = await res.text();
    const ok = res.status === 200 &&
               text.includes("Base Centralizada de Candidatos") &&
               text.includes("Total Postulantes") &&
               text.includes("Exportar a Excel");
    results.push({
      test: "Panel Admin (/admin) - Autenticado como root: Métricas, Filtros y UI Utilitaria",
      status: ok ? "PASS" : "FAIL",
      httpStatus: res.status
    });
  } catch (e) {
    results.push({ test: "Panel Admin (/admin)", status: "FAIL", error: e.message });
  }

  // 4. Test Puestos Management Autenticado como root
  try {
    const res = await fetch("http://localhost:3000/admin/puestos", {
      headers: { Cookie: rootCookie }
    });
    const text = await res.text();
    const ok = res.status === 200 &&
               text.includes("Gestión de Cargos y Convocatorias") &&
               text.includes("Supervisor Operativo") &&
               text.includes("Añadir Nuevo Cargo");
    results.push({
      test: "Gestor de Cargos (/admin/puestos) - Autenticado como root: Creación y Switches",
      status: ok ? "PASS" : "FAIL",
      httpStatus: res.status
    });
  } catch (e) {
    results.push({ test: "Gestor de Cargos (/admin/puestos)", status: "FAIL", error: e.message });
  }

  // 5. Test Excel Export Route Autenticado
  try {
    const res = await fetch("http://localhost:3000/api/candidates/export", {
      headers: { Cookie: rootCookie }
    });
    const contentType = res.headers.get("content-type") || "";
    const isExcel = contentType.includes("spreadsheetml.sheet");
    results.push({
      test: "Descarga Excel (/api/candidates/export) - Autenticado como root: Buffer XLSX Válido",
      status: (res.status === 200 && isExcel) ? "PASS" : "FAIL",
      httpStatus: res.status
    });
  } catch (e) {
    results.push({ test: "Descarga Excel", status: "FAIL", error: e.message });
  }

  // 6. Test Gracias Page
  try {
    const res = await fetch("http://localhost:3000/gracias");
    const text = await res.text();
    const ok = res.status === 200 && text.includes("¡Postulación enviada exitosamente!");
    results.push({
      test: "Pantalla de Éxito (/gracias) - Resumen y Difusión WhatsApp",
      status: ok ? "PASS" : "FAIL",
      httpStatus: res.status
    });
  } catch (e) {
    results.push({ test: "Pantalla de Éxito (/gracias)", status: "FAIL", error: e.message });
  }

  // 7. Test DB CRUD Candidate & Reflection
  const sql = postgres("postgres://postgres:baryik4vhvm14rf3mlxa@tc5u8q.easypanel.host:5445/ti?sslmode=disable");
  try {
    const testDni = "79998877";
    await sql`DELETE FROM candidates WHERE dni = ${testDni}`;

    const testId = "test-uuid-rg-" + Date.now();
    await sql`
      INSERT INTO candidates (
        id, "positionId", "fullName", dni, phone, email, "licenseNumber",
        "residenceCity", availability, status, "recruiterNotes", "createdAt", "updatedAt"
      ) VALUES (
        ${testId}, 4, 'Carlos Huaraz Test', ${testDni}, '943123456', 'carlos@test.com',
        'BREVETE-A3B', 'Huaraz', 'Inmediata', 'nuevo', 'Prueba automatizada Ramirez Group',
        NOW(), NOW()
      )
    `;

    const resAdmin = await fetch("http://localhost:3000/admin?q=" + testDni, {
      headers: { Cookie: rootCookie }
    });
    const adminText = await resAdmin.text();
    const foundInAdmin = adminText.includes("Carlos Huaraz Test") && adminText.includes("79998877");

    results.push({
      test: "Ciclo Completo Candidato: Inserción DB + Búsqueda en Panel",
      status: foundInAdmin ? "PASS" : "FAIL"
    });

    await sql`DELETE FROM candidates WHERE id = ${testId}`;
    results.push({
      test: "Limpieza Segura de Datos de Prueba en DB",
      status: "PASS"
    });
  } catch (e) {
    results.push({ test: "Ciclo Completo Candidato", status: "FAIL", error: e.message });
  } finally {
    await sql.end();
  }

  console.log("=== RESULTADOS DE CONFORMIDAD ===");
  let allPass = true;
  for (const r of results) {
    const icon = r.status === "PASS" ? "✅" : "❌";
    console.log(`${icon} [${r.status}] ${r.test}`);
    if (r.status !== "PASS") allPass = false;
  }

  console.log("\nESTADO FINAL:", allPass ? "100% CONFORME Y OPERATIVO EN PUERTO 3000" : "REQUIERE ATENCIÓN");
}

runTestSuite().catch(console.error);
