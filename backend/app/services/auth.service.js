const repository = require("../repositories/index");

module.exports = service = {
  login: async (username, password) => {
    const customer_check_name = await repository.userRepository.getByUsername(
      username
    );

    const compare_password = await bcrypt.compare(
      password,
      customer_check_name ? customer_check_name.password : ""
    );

    if (
      (username != customer_check_name.username &&
        password != customer_check_name.password) ||
      !compare_password
    ) {
      throw new BadRequestException("Username dan password salah");
    }

    if (customer_check_name.interval == 4) {
      throw new BadRequestException(
        "Akun anda di nonaktifkan silahkan hubungi admin"
      );
    }

    const token = jwt.sign(
      { user_id: customer_check_name.id || "" },
      "user_id"
    );

    return { token, data: customer_check_name };
  },
  register: async (username, email, password, re_password) => {
    if (username.length < 3 && email.length < 3 && password.length < 3)
      throw new BadRequestException(
        "Username,email, dan password minimal 3 character"
      );

    const check_email = utils.validateEmail(email);
    if (!check_email) throw new BadRequestException("Email harus mengandung @");

    username = username.trim();
    email = email.trim();
    password = password.trim();
    re_password = re_password.trim();

    if (password != re_password)
      throw new BadRequestException(
        "Password harus sama dengan password yang di ulang"
      );

    const check_existing_username =
      repository.userRepository.getByUsername(username);
    const check_existing_email = repository.userRepository.getByEmail(email);

    const data = await Promise.all([
      check_existing_username,
      check_existing_email,
    ]);

    let message = [];
    data.forEach((result, index) => {
      if (result)
        if (index == 0) message.push("Username yang di isi sudah terpakai");
        else message.push("Email yang di isi sudah terpakai");
    });

    if (message.length > 0) {
      throw new BadRequestException(
        message.length == 1 ? message : message.join(" dan ")
      );
    }

    const hash_password = await bcrypt.hash(password, 10);
    await repository.userRepository.create({
      username,
      email,
      password: hash_password,
    });

    return {
      message: message.save_success,
    };
  },
};
