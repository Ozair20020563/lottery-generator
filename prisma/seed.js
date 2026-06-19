const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const games = [
    {
      name: 'US Powerball',
      code: 'powerball',
      mainMin: 1,
      mainMax: 69,
      mainCount: 5,
      bonusMin: 1,
      bonusMax: 26,
      bonusCount: 1,
      hasBonus: true,
      description: 'Pick 5 numbers from 1-69 and 1 Powerball from 1-26',
      active: true
    },
    {
      name: 'Mega Millions',
      code: 'megamillions',
      mainMin: 1,
      mainMax: 70,
      mainCount: 5,
      bonusMin: 1,
      bonusMax: 25,
      bonusCount: 1,
      hasBonus: true,
      description: 'Pick 5 numbers from 1-70 and 1 Mega Ball from 1-25',
      active: true
    },
    {
      name: 'Lotto 6/49',
      code: 'lotto649',
      mainMin: 1,
      mainMax: 49,
      mainCount: 6,
      bonusCount: 0,
      hasBonus: false,
      description: 'Pick 6 numbers from 1-49',
      active: true
    }
  ];

  for (const game of games) {
    try {
      await prisma.lotteryGame.upsert({
        where: { code: game.code },
        update: game,
        create: game
      });
      console.log(`✅ Added/Updated: ${game.name}`);
    } catch (error) {
      console.error(`❌ Failed to add ${game.name}:`, error.message);
    }
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });