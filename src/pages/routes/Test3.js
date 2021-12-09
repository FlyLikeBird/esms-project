import { useState } from 'react';
import { Row, Col, Form, Input, Button, Checkbox } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const DynamicFieldSet = () => {
  const onFinish = values => {
    console.log('Received values of form:', values);
  };
  let [form] = Form.useForm();
  let [disabled, setDisabled] = useState(false);
  return (
    <Form name="dynamic_form_item" form={form} {...formItemLayoutWithOutLabel} >
      <Form.Item {...formItemLayoutWithOutLabel}>
          
      </Form.Item>
      <Form.Item
        name='ids'
        {...formItemLayoutWithOutLabel}
      >
          <Checkbox.Group>
                <Row>
                    <Col span={8}>
                        <Checkbox value='a'>A</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value='b'>B</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value='c'>C</Checkbox>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Checkbox value='d'>D</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value='e'>E</Checkbox>
                    </Col>
                    <Col span={8}>
                        <Checkbox value='f'>F</Checkbox>
                    </Col>
                </Row>
          </Checkbox.Group>
      </Form.Item>
      <Form.List
        name="names"
        // rules={[
        //   {
        //     validator: async (_, names) => {
        //         console.log(names);
        //       if (!names || names.length < 2) {
        //         return Promise.reject(new Error('At least 2 passengers'));
        //       }
        //     },
        //   },
        // ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => {
                console.log(field);
                console.log('-----');
              return (<Form.Item
                {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                label={index === 0 ? 'Passengers' : ''}
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                //   rules={[
                //     {
                //       required: true,
                //       whitespace: true,
                //       message: "Please input passenger's name or delete this field.",
                //     },
                //   ]}
                  noStyle
                >
                  <Input placeholder="passenger name" style={{ width: '60%' }} disabled={disabled} addonAfter='分钟' addonBefore={`第${field.name + 1}次`} />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            )})}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                Add field
              </Button>          
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" onClick={()=>{
            form.validateFields()
            .then(values=>{
                console.log(values);
            })
        }}>
            Submit
        </Button>
        <Button onClick={()=>{
            setDisabled(true);
        }}>禁止</Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicFieldSet;