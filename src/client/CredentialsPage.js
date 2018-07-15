import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Form, Icon, Input, Button } from 'antd';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

// export default ProfileInterestSkillButtons;

export default class CredentialsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      apiKey: '',
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  // handleChange(event) {
  //   this.setState({
  //     [event.target.name]: event.target.value,
  //   });
  // }

  handleSubmit(event) {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.state.username = values.username;
        this.state.apiKey = values.apiKey;
        console.log('Received values of form: ', values);
      }
    });

    // const rootUrl = 'http://localhost:4040/';
    // const rootUrl = '/api/';
    const rootUrl =
      process.env.NODE_ENV === 'production'
        ? '/api/'
        : 'http://localhost:4040/api/';
    axios({
      url: `${rootUrl}tournaments/${this.state.username}/${this.state.apiKey}`,
      method: 'get',
      headers: {
        begDate: '2018-01-01', // don't hard code this in the future
        endDate: '2018-07-01' // don't hard code this in the future
      }
    })
      .then(response => {
        if (response.data) {
          // console.log(`response from init sign in: ${JSON.stringify(response)}`);
          this.props.changeView(response.data);
        }
      })
      .catch(ex => {
        // TODO: Convert this into it's own component
        alert('error occurred. Refresh and try again');
      });
  }

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;

    // Only show error after a field is touched.
    const userNameError =
      isFieldTouched('username') && getFieldError('username');
    const apiError = isFieldTouched('apiKey') && getFieldError('apiKey');
    return (
      <div>
        <Row>
          <Col span={8} offset={8}>
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <FormItem
                validateStatus={userNameError ? 'error' : ''}
                help={userNameError || ''}
              >
                {getFieldDecorator('username', {
                  rules: [
                    { required: true, message: 'Please input your username' }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="Username"
                  />
                )}
              </FormItem>
              <FormItem
                validateStatus={apiError ? 'error' : ''}
                help={apiError || ''}
              >
                {getFieldDecorator('apiKey', {
                  rules: [
                    { required: true, message: 'Please input your API key' }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                    placeholder="API Key"
                  />
                )}
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={hasErrors(getFieldsError())}
                >
                  Submit
                </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export const CredentialsPageForm = Form.create()(CredentialsPage);
