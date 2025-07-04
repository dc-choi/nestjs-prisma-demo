export const deletePasswordInLog = (body) => {
    const deepCopyBody = Object.assign({}, body); // 깊은 복사

    if (deepCopyBody?.password) {
        deepCopyBody.password = '';
    }

    return deepCopyBody;
};
