import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'AppSettings'
      ORDER BY ordinal_position;
    `;

    console.log('Current AppSettings columns:');
    console.table(result);

    const columnNames = result.map(r => r.column_name);
    const requiredColumns = [
      'primaryColor',
      'accentColor',
      'backgroundColor',
      'textColor',
      'borderRadius',
      'fontFamily',
      'buttonStyle',
      'darkMode',
      'customCSS'
    ];

    console.log('\nChecking for theme columns:');
    requiredColumns.forEach(col => {
      const exists = columnNames.includes(col);
      console.log(`  ${col}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
