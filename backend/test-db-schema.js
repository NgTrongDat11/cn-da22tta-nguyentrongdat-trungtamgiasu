/**
 * TEST DATABASE SCHEMA
 * Script này để kiểm tra column names thực tế trong PostgreSQL
 */

import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/trung_tam_gia_su',
});

async function checkSchema() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Query để lấy column names của tất cả các tables
    const query = `
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;

    const result = await client.query(query);
    
    // Group by table
    const tables = {};
    result.rows.forEach(row => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = [];
      }
      tables[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable
      });
    });

    // Print results
    console.log('📋 DATABASE SCHEMA - ACTUAL COLUMN NAMES:\n');
    console.log('='.repeat(80));
    
    for (const [tableName, columns] of Object.entries(tables)) {
      console.log(`\n🔹 TABLE: ${tableName}`);
      console.log('-'.repeat(80));
      columns.forEach(col => {
        const nullable = col.nullable === 'YES' ? '(nullable)' : '(NOT NULL)';
        console.log(`   ${col.column.padEnd(20)} | ${col.type.padEnd(20)} | ${nullable}`);
      });
    }
    
    console.log('\n' + '='.repeat(80));

    // Test query với Prisma-style names
    console.log('\n\n🧪 TESTING QUERIES:\n');
    
    try {
      const testQuery = await client.query('SELECT * FROM "TaiKhoan" LIMIT 1');
      console.log('✅ Query với "TaiKhoan" (PascalCase) - SUCCESS');
      if (testQuery.rows[0]) {
        console.log('   Sample row columns:', Object.keys(testQuery.rows[0]));
      }
    } catch (err) {
      console.log('❌ Query với "TaiKhoan" (PascalCase) - FAILED:', err.message);
    }

    try {
      const testQuery2 = await client.query('SELECT * FROM taikhoan LIMIT 1');
      console.log('✅ Query với "taikhoan" (lowercase) - SUCCESS');
      if (testQuery2.rows[0]) {
        console.log('   Sample row columns:', Object.keys(testQuery2.rows[0]));
      }
    } catch (err) {
      console.log('❌ Query với "taikhoan" (lowercase) - FAILED:', err.message);
    }

    // Count records
    console.log('\n\n📊 RECORD COUNTS:\n');
    const tables_to_check = ['TaiKhoan', 'GiaSu', 'HocVien', 'MonHoc', 'LopHoc', 'DangKy', 'DanhGia'];
    
    for (const table of tables_to_check) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM "${table}"`);
        console.log(`   ${table.padEnd(20)}: ${countResult.rows[0].count} rows`);
      } catch (err) {
        console.log(`   ${table.padEnd(20)}: Error - ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkSchema();
