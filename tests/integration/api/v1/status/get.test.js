const { version } = require("react");

test("GET to /api/v1/status should returno 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  // Teste auto de "updated_at" da API
  const responseBody = await response.json();
  const pasedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(pasedUpdatedAt);

  // postgres version
  expect(responseBody.dependencies.database.version).toEqual("16.0");

  // Conexões máximas
  expect(responseBody.dependencies.database.Max_connections).toEqual(100);
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);

  // Conexões usadas
  expect(responseBody.dependencies.database.in_use_connections).toEqual("1");
});
