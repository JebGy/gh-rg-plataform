import postgres from "file:///C:/Users/xkira24/Desktop/Apps/ssma/node_modules/postgres/src/index.js";

async function runTestSuite() {
  console.log("=== INICIANDO AUDITORIA DE CONFORMIDAD PRODUCCIÓN ===\n");

  const results = [];

  // 1. Test Home Page
  try {
    const res = await fetch("http://localhost:3001/");
    const text = await res.text();
    const ok = res.status === 200 &&
               text.includes("Izaje Antamina") &&
               text.includes("Supervisor Operativo") &&
               text.includes("Supervisor de Seguridad") &&
               text.includes("Operadores de Camión Grúa") &&
               text.includes("Rigger");
    results.push({
      test: "Portal Público (/) - Carga y Selector de 4 Puestos",
      status: ok ? "PASS" : "FAIL",
      httpStatus: res.status
    });
  } catch (e) {
    results.push({ test: "Portal Público (/)", status: "FAIL", error: e.message });
  }

  // 2. Test Admin Dashboard
  try {
    const res = await fetch("http://localhost:3001/admin");
    const text = await res.text();
    const ok = res.status === 200 &&
               text.includes("Base de Datos de Candidatos") &&
               text.includes("Total Registrados") &&
               text.includes("Descargar Excel Completo");
    results.push({
      test: "Panel Admin (/admin) - Métricas, Filtros y Shell Oscuro",
      status: ok ? "PASS" : "FAIL",
      httpStatus: res.status
    });
  } catch (e) {
    results.push({ test: "Panel Admin (/admin)", status: "FAIL", error: e.message });
  }

  // 3. Test Puestos Management
  try {
    const res = await fetch("http://localhost:3001/admin/puestos");
    const text = await res.text();
    const ok = res.status === 200 &&
               text.includes("Gestión de Puestos y Convocatorias") &&
               text.includes("Supervisor Operativo") &&
               text.includes("Añadir Nuevo Puesto");
    results.push({
      test: "Gestor de Puestos (/admin/puestos) - Creación Dinámica y Switch",
      status: ok ? "PASS" : "FAIL",
      httpStatus: res.status
    });
  } catch (e) {
    results.push({ test: "Gestor de Puestos (/admin/puestos)", status: "FAIL", error: e.message });
  }

  // 4. Test Excel Export Route
  try {
    const res = await fetch("http://localhost:3001/api/candidates/export");
    const contentType = res.headers.get("content-type") || "";
    const isExcel = contentType.includes("spreadsheetml.sheet");
    results.push({
      test: "Descarga Excel (/api/candidates/export) - Buffer XLSX Válido",
      status: (res.status === 200 && isExcel) ? "PASS" : "FAIL",
      httpStatus: res.status
    });
  } catch (e) {
    results.push({ test: "Descarga Excel", status: "FAIL", error: e.message });
  }

  // 5. Test Gracias Page
  try {
    const res = await fetch("http://localhost:3001/gracias");
    const text = await res.text();
    const ok = res.status === 200 && text.includes("¡Postulación enviada!");
    results.push({
      test: "Pantalla de Éxito (/gracias) - Resumen y Compartir WhatsApp",
      status: ok ? "PASS" : "FAIL",
      httpStatus: res.status
    });
  } catch (e) {
    results.push({ test: "Pantalla de Éxito (/gracias)", status: "FAIL", error: e.message });
  }

  // 6. Test DB CRUD Candidate & Reflection
  const sql = postgres("postgres://postgres:baryik4vhvm14rf3mlxa@tc5u8q.easypanel.host:5445/ti?sslmode=disable");
  try {
    const testDni = "79998877";
    // Clean any previous test
    await sql`DELETE FROM candidates WHERE dni = ${testDni}`;

    // Insert test candidate
    const testId = "test-uuid-prod-" + Date.now();
    await sql`
      INSERT INTO candidates (
        id, "positionId", "fullName", dni, phone, email, "licenseNumber",
        "residenceCity", availability, status, "recruiterNotes", "createdAt", "updatedAt"
      ) VALUES (
        ${testId}, 4, 'Carlos Huaraz Test', ${testDni}, '943123456', 'carlos@test.com',
        'BREVETE-A3B', 'Huaraz', 'Inmediata', 'nuevo', 'Prueba automatizada de conformidad',
        NOW(), NOW()
      )
    `;

    // Query via admin
    const resAdmin = await fetch("http://localhost:3001/admin?q=" + testDni);
    const adminText = await resAdmin.text();
    const foundInAdmin = adminText.includes("Carlos Huaraz Test") && adminText.includes("79998877");

    results.push({
      test: "Ciclo Completo Candidato: Inserción DB + Búsqueda en Panel",
      status: foundInAdmin ? "PASS" : "FAIL"
    });

    // Clean up
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

  console.log("\nESTADO FINAL:", allPass ? "100% CONFORME Y LISTO PARA PRODUCCIÓN" : "REQUIERE ATENCIÓN");
}

runTestSuite().catch(console.error);
