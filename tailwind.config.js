module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        buttonColor: "#25bcf1",
        buttonHoverColor: "#138496",
        individualPageBG: "#f2f3f8",
        borderColor: "#377dff",
        pageHeading: "#1b1b28",
        tableHeading: "#212529",
        tableData: "#252525",
        browseBG: "#eef0f2",
      },
      spacing: {
        18: "4.5625rem",
        54: "13.5rem",
        67.5: "16.875rem",
        72.25: "17.5625rem",
        350: "87.5rem",
        "1/8": "12.5%",
        ".5/8": "6.25%",
        "2/8": "25%",
        9.5: "2.40rem"
      },
      width: {
        "0.5/9": "5.5555555%",
        "0.7/9": "7.7777777%",
        "1/9": "11.1111111%",
        "2/9": "22.2222222%",
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',

      },
      width: {
        "0.5/9": "5.5555555%",
        "0.7/9": "7.7777777%",
        "1/9": "11.1111111%",
        "2/9": "22.2222222%",
        "1.5/9": "16.666%",
        "0.5/5": "10%",
        "0.5/5": "10%",
        "1.5/9": "16.666%"
      },
      transitionDuration: {
        210: "210ms"
      },
      fontFamily: {
        Poppins: ['Poppins', 'sans-serif']
      },
      borderWidth: {
        1: "1px"
      },
      fontSize: {
        "xs2": "13px"
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      animation: ['group-hover'],
      opacity: ['disabled'],
    },
  },
  plugins: [],
}
