import toast, { Toaster } from 'react-hot-toast';

export const notifySuccess = (message = 'The Process is successful!') => {
    toast.success(message)
    // console.log(message);
};

export const Toast = () => {
    return <Toaster position="top-center"
    reverseOrder={false} />;
};

