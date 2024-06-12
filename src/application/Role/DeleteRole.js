class DeleteRole {
    constructor({ deleteFactory, roleRepository }) {
        this.deleteFactory = deleteFactory;
        this.roleRepository = roleRepository;
    }

    async execute(props) {
        const _delete = this.deleteFactory.createDelete({
            repository: this.roleRepository,
        });

        const ans = await _delete.execute({
            ids: props.ids,
            userId: props.userId,
        });

        return ans;
    }
}

module.exports = DeleteRole;
