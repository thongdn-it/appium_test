import { connect } from "imap-simple";

// Cấu hình IMAP để kết nối với Gmail
const imapConfig = {
  imap: {
    user: "thongdn.2019@gmail.com", // TODO: change email for imap
    password: "pwbk ... ... wwzg", // TODO: change app password for imap
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  },
};

async function getOTPFromEmail() {
  const connection = await connect(imapConfig);
  await connection.openBox("INBOX");

  //UNSEEN
  const searchCriteria = ["ALL", ["FROM", "facebookmail.com"]];
  const fetchOptions = { bodies: ["HEADER", "TEXT"], markSeen: true };

  const messages = await connection.search(searchCriteria, fetchOptions);

  let otpCode = null;

  for (let message of messages) {
    const body = message.parts.find((part) => part.which === "TEXT").body;
    const otpMatch = body.match(/(<center>)\d{5}(<\/center>)/);
    if (otpMatch) {
      otpCode = otpMatch[0].match(/\d{5}/)[0];
      break;
    }
  }

  await connection.end();

  if (otpCode) {
    console.log("OTP nhận được:", otpCode);
    return otpCode;
  } else {
    console.log("Không tìm thấy mã OTP trong email");
    return "";
  }
}
export default getOTPFromEmail;
