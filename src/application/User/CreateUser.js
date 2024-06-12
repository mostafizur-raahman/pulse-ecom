class CreateUser {
    constructor({
        userRepository,
        Fault,
        requestValidator,
        roleRepository,
        encryption,
    }) {
        this.userRepository = userRepository;
        this.Fault = Fault;
        this.requestValidator = requestValidator;
        this.roleRepository = roleRepository;
        this.encryption = encryption;
    }

    async execute(data) {
        const isExist = await this.roleRepository.findById(data.roleId);

        if (!isExist) {
            throw new this.Fault("Role not found");
        }

        const userExist = await this.userRepository.existsByQuery({
            email: data.email,
        });

        if (userExist) {
            throw new this.Fault("User already exists");
        }

        data.password = this.encryption.encrypt(data.password);

        const newDoc = await this.userRepository.create({
            ...data,
        });

        return this.userRepository.cleanResponse(data, [
            "password",
            "states",
            "isDeleted",
        ]);
    }
}

module.exports = CreateUser;
