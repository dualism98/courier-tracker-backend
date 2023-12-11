import { Schema, model } from "mongoose";
import ModelsNames from "./ModelsNames";

const schema = new Schema({
    avatar: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
})

const User = model(ModelsNames.User, schema);

export default User;
