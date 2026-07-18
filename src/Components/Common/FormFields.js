import {styled, TextField} from '@mui/material';


export const InputText = styled(TextField)(({theme})=>({
    color:theme.colorScheme.palette.light.primary.contrastText,
    borderRadius:'20px'
}))
