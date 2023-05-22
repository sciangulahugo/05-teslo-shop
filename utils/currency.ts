export const format = (value: number) => {
    // Crear el formateador
    const formatter = new Intl.NumberFormat('en-Us', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return formatter.format(value);
};