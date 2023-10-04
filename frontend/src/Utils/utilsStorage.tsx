const addStorage = (name: string, value: string) => {
    localStorage.setItem(name, value);
};

const getStorage = (name: string) => {
    return localStorage.getItem(name);
};

const removeStorage = (name: string) => {
    localStorage.removeItem(name);
}

export { addStorage, getStorage, removeStorage };