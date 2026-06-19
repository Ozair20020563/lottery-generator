import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, includeNumbers, excludeNumbers, lines } = body;

    // Game configurations
    const gameConfigs: Record<string, { mainMax: number; mainCount: number; bonusMax?: number; bonusCount: number }> = {
      '1': { mainMax: 69, mainCount: 5, bonusMax: 26, bonusCount: 1 },
      '2': { mainMax: 70, mainCount: 5, bonusMax: 25, bonusCount: 1 },
      '3': { mainMax: 49, mainCount: 6, bonusCount: 0 },
    };

    const config = gameConfigs[gameId];
    if (!config) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const results = [];
    const linesCount = lines || 5;
    const include = includeNumbers || [];
    const exclude = excludeNumbers || [];

    for (let line = 0; line < linesCount; line++) {
      // Generate main numbers
      const available: number[] = [];
      for (let i = 1; i <= config.mainMax; i++) {
        if (!exclude.includes(i)) available.push(i);
      }
      
      // Shuffle
      for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
      }
      
      let main = [...include];
      const needed = config.mainCount - main.length;
      main = [...main, ...available.slice(0, needed)];
      main.sort((a, b) => a - b);
      
      // Generate bonus numbers
      let bonus: number[] = [];
      if (config.bonusCount > 0 && config.bonusMax) {
        for (let i = 0; i < config.bonusCount; i++) {
          bonus.push(Math.floor(Math.random() * config.bonusMax) + 1);
        }
        bonus.sort((a, b) => a - b);
      }
      
      // Calculate uniqueness score
      let score = 100;
      const warnings: string[] = [];
      
      const birthdayCount = main.filter(n => n <= 31).length;
      if (birthdayCount > 3) {
        score -= 25;
        warnings.push(`${birthdayCount} numbers in birthday range (1-31)`);
      }
      
      let consecutiveCount = 0;
      for (let i = 0; i < main.length - 1; i++) {
        if (main[i + 1] === main[i] + 1) consecutiveCount++;
      }
      if (consecutiveCount >= 2) {
        score -= 30;
        warnings.push(`${consecutiveCount + 1} consecutive numbers detected`);
      }
      
      const oddCount = main.filter(n => n % 2 === 1).length;
      if (oddCount === 0 || oddCount === main.length) {
        score -= 20;
        warnings.push("All numbers are same parity");
      }
      
      results.push({
        main,
        bonus,
        uniqueness: { score: Math.max(0, score), warnings }
      });
    }
    
    return NextResponse.json({ success: true, numbers: results });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json({ error: 'Failed to generate numbers' }, { status: 500 });
  }
}