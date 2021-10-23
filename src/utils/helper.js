import moment from "moment";

export const checkIfDeadlinePassed = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);

    if (today > deadlineDate) {
        return true;
    } else {
        return false;
    }
};

export const formatDate = (dateAsISOString) => {
    return moment(dateAsISOString).format("DD.MM.YYYY - h:mm a");
};
