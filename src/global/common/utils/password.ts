import { cloneDeep } from 'es-toolkit';

export const deletePasswordInLog = (body: any) => {
    const deepCopyBody = cloneDeep(body); // 깊은 복사

    if (deepCopyBody?.password) {
        deepCopyBody.password = '';
    }

    return deepCopyBody;
};
