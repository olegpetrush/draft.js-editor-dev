import React from 'react'

interface ErrorBoundaryProps {}
interface ErrorBoundaryState{
    hasError:boolean
}
class ErrorBoundary extends React.Component<ErrorBoundaryProps,ErrorBoundaryState> {
    constructor(props:ErrorBoundaryProps){
        super(props)
        this.state={
            hasError:false
        }
    }

    componentDidCatch(error:any,errorInfo:any){
        console.log(error,errorInfo)
       this.setState({
           hasError:true
       })
    }

    render(){
        const {hasError} = this.state
        const {children} = this.props
        if(hasError){
            return <h1>Something went wrong</h1>
        }
        return children
    }
}

export default ErrorBoundary