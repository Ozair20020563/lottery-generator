import { NextResponse } from 'next/server';

export async function GET() {
  const games = [
    {
      id: '1',
      name: 'Powerball',
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
    },
    {
      id: '4',
      name: 'Super 7',
      code: 'super7',
      mainMin: 1,
      mainMax: 47,
      mainCount: 7,
      bonusCount: 0,
      hasBonus: false,
      description: 'Pick 7 numbers from 1-47',
      active: true
    },
    {
      id: '5',
      name: 'Lotto Max',
      code: 'lottomax',
      mainMin: 1,
      mainMax: 50,
      mainCount: 7,
      bonusCount: 0,
      hasBonus: false,
      description: 'Pick 7 numbers from 1-50',
      active: true
    },
    {
      id: '6',
      name: 'Pick 2',
      code: 'pick2',
      mainMin: 0,
      mainMax: 9,
      mainCount: 2,
      bonusCount: 0,
      hasBonus: false,
      description: 'Pick 2 digits from 0-9',
      active: true
    },
    {
      id: '7',
      name: 'Pick 3',
      code: 'pick3',
      mainMin: 0,
      mainMax: 9,
      mainCount: 3,
      bonusCount: 0,
      hasBonus: false,
      description: 'Pick 3 digits from 0-9',
      active: true
    },
    {
      id: '8',
      name: 'Pick 4',
      code: 'pick4',
      mainMin: 0,
      mainMax: 9,
      mainCount: 4,
      bonusCount: 0,
      hasBonus: false,
      description: 'Pick 4 digits from 0-9',
      active: true
    },
    {
      id: '9',
      name: 'Win For Life',
      code: 'winforlife',
      mainMin: 1,
      mainMax: 49,
      mainCount: 5,
      bonusMin: 1,
      bonusMax: 10,
      bonusCount: 1,
      hasBonus: true,
      description: 'Pick 5 numbers from 1-49 and 1 from 1-10',
      active: true
    },
    {
      id: '10',
      name: 'EuroMillions',
      code: 'euromillions',
      mainMin: 1,
      mainMax: 50,
      mainCount: 5,
      bonusMin: 1,
      bonusMax: 12,
      bonusCount: 2,
      hasBonus: true,
      description: 'Pick 5 numbers from 1-50 and 2 Lucky Stars from 1-12',
      active: true
    },
    {
      id: '11',
      name: 'UK 49s',
      code: 'uk49s',
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