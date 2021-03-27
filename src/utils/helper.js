const checkIfDeadlinePassed = (deadline) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Deadline is in format: D.M.Y
    const deadlineSplit = deadline.split(".");

    // Cleaner way of doing this?
    if (year > deadlineSplit[2]) {
        return true;
    } else if (year < deadlineSplit[2]) {
        return false;
    } else {
        if (month > deadlineSplit[1]) {
            return true;
        } else if (month < deadlineSplit[1]) {
            return false;
        } else {
            if (day > deadlineSplit[0]) {
                return true;
            } else if (day < deadlineSplit[0]) {
                return false;
            } else {
                return false;
            }
        }
    }
};

module.exports = {
    checkIfDeadlinePassed,
};
