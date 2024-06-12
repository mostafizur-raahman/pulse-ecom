class Greet {
    execute(APP_NAME, current_path) {
        return {
            app: APP_NAME,
            current_path,
            health_check: null,
            paths: current_path?.match(/v1/)
                ? "Please read API docs for list of available routes"
                : ["/v1"],
        };
    }
}

module.exports = Greet;
