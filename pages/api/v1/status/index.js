import database from "infra/database.js";

async function status(request, response) {
  // Updated
  const updatedAt = new Date().toISOString();

  // version postgres
  const DatabaseVersionResult = await database.query("SHOW server_version;");
  const DatabaseVersionValue = DatabaseVersionResult.rows[0].server_version;

  // Conexões máximas
  const MaxConectionsResult = await database.query("Show max_connections;");
  const MaxConectionsValue = MaxConectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResults = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResults.rows[0].count;

  // Conexões em uso
  const ConnInUseResult = await database.query(
    "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';",
  );
  const ConnInUseValue = ConnInUseResult.rows[0].count;

  // Endpoint
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: DatabaseVersionValue,
        Max_connections: parseInt(MaxConectionsValue),
        in_use_connections: ConnInUseValue,
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
