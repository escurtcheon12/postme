let utils = {
  convertTimeToJs: (date) => {
    let a = date + "";
    let b = a.slice(0, 10).replace("T", " ");
    return b;
  },

  convertIndonesiaTime: (time, status = 1) => {
    let date = new Date(time);

    let month = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    let result =
      date.getDate() +
      " " +
      month[date.getMonth()] +
      " " +
      date.getFullYear() +
      "";

    if (status) {
      result += ", " + date.toLocaleTimeString("default");
    }

    return result;
  },

  convertTimeToIndonesiaDay: (time) => {
    let days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    let d = new Date(time);

    const dayName = days[d.getDay()];

    return dayName;
  },

  convertTimeToIndonesiaMonth: (number) => {
    const convertToIndex = number;

    let month = [
      "December",
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
    ];

    // console.log(number, month[convertToIndex]);

    return month[convertToIndex];
  },

  dynamicSort: (property) => {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      let result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  },

  formatRupiah: (number, status = 0) => {
    // if (number >= 9 && status) {
    //   return "Rp. " + number.toString().split("").splice(0, 3).join("") + "K";
    // } else {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
    // }
  },
  substractDate: (date, num, key) => {
    var result = new Date(date);

    if (key === "Month") {
      result.setMonth(result.getMonth() - num);
      return result;
    } else if (key === "Year") {
      result.setFullYear(result.getFullYear() - num);
      return result;
    } else {
      result.setDate(result.getDate() - num);
      return result;
    }
  },

  substractDays: (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  },
  substractMonths: (date, months) => {
    var result = new Date(date);
    result.setMonth(result.getMonth() - months);
    return result;
  },
  substractYears: (date, years) => {
    var result = new Date(date);
    result.setFullYear(result.getFullYear() - years);
    return result;
  },
};

module.exports = utils;
