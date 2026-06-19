import { NextResponse } from 'next/server';

export async function GET() {
  const games = [
    {
      id: '1',
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
      id: '2',
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
      id: '3',
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
  
  return NextResponse.json(games);
}