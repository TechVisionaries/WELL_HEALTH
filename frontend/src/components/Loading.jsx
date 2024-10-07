import { Backdrop, CircularProgress } from "@mui/material"

function Loading() {
  return (
    <div>

    <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={true}
    >
        <CircularProgress color="inherit" />
    </Backdrop>
      
    </div>
  )
}

export default Loading
