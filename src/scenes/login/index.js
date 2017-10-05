import React from 'react'
import { connect } from 'react-redux'

import Auth from '../../services/auth'
import { errorSelector } from '../../data/user/selectors'
import { getToken } from '../../data/user/actions'

import Grid from 'material-ui/Grid'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'

class Login extends React.Component {
  state = {
    username: '',
    password: ''
  }

  handleChange = name => e => {
    this.setState({
      [name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    const { actions, history } = this.props
    const { username, password } = this.state
    e.preventDefault()
    actions.getToken(username, password)
      .then(({ error, payload }) => {
        if (error) {
          this.setState({ error })
        } else {
          Auth.saveToken(payload.token)
          history.push('/')
        }
      })
  }

  render () {
    const { actions, user } = this.props
    const { username, password, error } = this.state

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={user.error}
          message={<span>Incorrect username or password.</span>}
        />
        <Grid container justify='center'>
          <form onSubmit={this.handleSubmit}>
            <Card>
              <CardContent>
                <Grid container direction='column'>
                  <TextField
                    id='username'
                    label='Username'
                    onChange={this.handleChange('username')}
                  />
                  <TextField
                    id='password'
                    label='Password'
                    type='password'
                    onChange={this.handleChange('password')}
                  />
                </Grid>
              </CardContent>
              <CardActions>
                <Button
                  type='submit'
                  color='primary'
                  disabled={!(username && password)}
                >
                  Login
                </Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: {
    error: errorSelector(state)
  }
})

const mapDispatchToProps = dispatch => ({
  actions: {
    getToken: (username, password) => dispatch(getToken(username, password))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)