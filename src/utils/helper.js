export const checkIfDeadlinePassed = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);

    if (today > deadlineDate) {
        return true;
    } else {
        return false;
    }
};
