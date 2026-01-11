const { Solar, Lunar } = require('lunar-javascript');

function calculateDaewun(gender, year, month, day, hour, minute) {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  console.log(`\n--- Verification for ${year}-${month}-${day} ${gender} ---`);
  console.log(`Solar: ${solar.toFullString()}`);
  console.log(
    `Pillars: ${eightChar.getYear()} ${eightChar.getMonth()} ${eightChar.getDay()} ${eightChar.getTime()}`
  );

  // Explicitly set gender for Yun (0=Female, 1=Male via Library spec? Actually 1=Man, 0=Woman)
  // eightChar.getYun(gender) parameter:
  // 1 = Yang (Man), 0 = Yin (Woman)? Or is it based on Gender string?
  // Let's check docs or standard usage. Usually 1=Male, 0=Female.
  const genderType = gender === 'male' || gender === 1 ? 1 : 0;

  const yun = eightChar.getYun(genderType);

  // Daewoon Array
  const daewunArr = yun.getDaYun();

  console.log('Daewoon List (Lunar Lib):');
  // Usually getDaYun returns array of DaYun objects.
  // Each DaYun has getStartYear() etc.

  for (let i = 0; i < daewunArr.length; i++) {
    const dw = daewunArr[i];
    console.log(`Index ${i}: StartAge ${dw.getStartYear()}, GanZhi: ${dw.getGanZhi()}`);
  }

  // My current age (2025/2026 check)
  // Let's use 2026.
  const currentYear = 2026;
  const currentAge = currentYear - solar.getYear() + 1; // Korean Age
  const manAge = currentYear - solar.getYear(); // Man Age

  console.log(`Current Year: ${currentYear}, Korean Age: ${currentAge}, Man Age: ${manAge}`);

  // Library uses 'StartYear' (Age). Is it Korean or Man?
  // Default is Man Age usually for Daewoon calcs in modern libraries, but traditional is Korean.
  // Lunar-JS getStartYear returns the age when it starts.

  // Find active
  let activeDw = null;
  // It is sorted by age.
  // We want biggest StartAge <= CurrentAge.
  // Actually Daewoon logic: If Daewoon starts at 4. 4, 14, 24...
  // If I am 38. 34~43 is active.
  // So find item where startYear <= currentAge. Iterate.

  let targetAge = currentAge; // Assuming Korean Age for safer match with typical KR usage? Or wait for console output to judge.

  // Check typical Daewoon numbers (e.g. 4 vs 5)
  // Let's print using 'targetAge' variable

  for (let i = 0; i < daewunArr.length; i++) {
    if (targetAge >= daewunArr[i].getStartYear()) {
      activeDw = daewunArr[i];
    }
  }

  if (activeDw) {
    console.log(
      `Active Daewoon (if Age=${targetAge}): ${activeDw.getGanZhi()} (${activeDw.getStartYear()}~)`
    );
  } else {
    console.log('No active Daewoon found?');
  }
}

calculateDaewun('male', 1988, 7, 14, 7, 15);
calculateDaewun('female', 1988, 11, 15, 11, 23);
