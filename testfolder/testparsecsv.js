const parseCSV = require("../helperfunctions/parseCSV");

(async () => {
  const csv = await parseCSV(
    "http://res.cloudinary.com/degraphe-tech/raw/upload/v1625618287/jnp8gcfzabkep3mk6ssd.csv",
    ",",
    {
      remote: true,
    }
  );

  console.log(csv);
})();
