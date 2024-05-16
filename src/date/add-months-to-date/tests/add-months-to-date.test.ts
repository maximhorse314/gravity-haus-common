import addMonthsToDate from '../add-months-to-date';

describe('addMonthsToDate', () => {
  it('should add one month to a date', () => {
    const date = new Date('2022-10-31T10:00:00.000Z');
    const addAMonth = addMonthsToDate(date, 1);
    expect(addAMonth.getMonth()).toBe(10); // 10 is November
    expect(addAMonth.getDate()).toBe(30);

    expect(date.getMonth()).toBe(9); // 9 is October
  });

  it('should add 12 months to a date', () => {
    const date = new Date('2022-10-31T10:00:00.000Z');
    const addAYear = addMonthsToDate(date, 12);

    expect(addAYear.getMonth()).toBe(9); // 9 is October
    expect(addAYear.getFullYear()).toBe(2023);
  });
});
