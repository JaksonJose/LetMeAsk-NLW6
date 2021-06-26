import { ButtonHTMLAttributes } from "react"
import '../styles/button.scss'

/* this will take every HTML button properts  */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean,
};

export function Button({isOutlined = false, ...props}: ButtonProps){
    return(
        <button className={`button ${isOutlined ? 'outlined' : ''}`} {...props} />
    )
}