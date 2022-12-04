import * as Yup from "yup";

export const signUpSchema = Yup.object({
    cname1: Yup.string().min(2).max(10).required("please enter name"),
    bdate1: Yup.string().required("Please Enter date"),
    bnumber1: Yup.number().required("Please enter Bill number"),
    item: Yup.string().min(1).required("Please enter item")
});