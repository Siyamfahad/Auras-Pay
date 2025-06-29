const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    const adminEmail = 'admin@aurasepay.com';
    const adminPassword = 'admin123';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log(`📧 Email: ${adminEmail}`);
      
      // Update to ensure admin flag is set (if the field exists)
      try {
        await prisma.user.update({
          where: { email: adminEmail },
          data: { isAdmin: true }
        });
        console.log('✅ Admin flag updated');
      } catch (error) {
        console.log('⚠️  Admin flag not available (probably need to run migration)');
      }
      
      return;
    }

    // Hash the password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin user
    try {
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash,
          isAdmin: true,
          transactionCredits: 1000, // Give admin plenty of credits
          status: 'ACTIVE'
        },
        select: {
          id: true,
          email: true,
          isAdmin: true,
          transactionCredits: true,
          createdAt: true
        }
      });

      console.log('🎉 Admin user created successfully!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
      console.log('👤 User ID:', admin.id);
      console.log('💳 Credits:', admin.transactionCredits);
      console.log('📅 Created:', admin.createdAt);
    } catch (error) {
      // If isAdmin field doesn't exist, create without it
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash,
          transactionCredits: 1000,
          status: 'ACTIVE'
        },
        select: {
          id: true,
          email: true,
          transactionCredits: true,
          createdAt: true
        }
      });

      console.log('🎉 Admin user created successfully (without isAdmin flag)!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
      console.log('👤 User ID:', admin.id);
      console.log('💳 Credits:', admin.transactionCredits);
      console.log('📅 Created:', admin.createdAt);
      console.log('⚠️  Run "npx prisma migrate dev --name add_admin_field" to add isAdmin field');
    }

    console.log('');
    console.log('🔐 Login at: http://localhost:5174/login');
    console.log('⚡ Admin Panel: http://localhost:5174/admin');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the admin password after first login!');

  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdmin(); 