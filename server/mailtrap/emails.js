export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reser Your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.log(`Error in sending password reset ${error}`);
    throw new Error(`Error in sending password reset ${error}`);
  }
};
