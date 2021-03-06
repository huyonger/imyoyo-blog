import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { PushProps } from '../push.model';
import BreadCrumb from '../../../components/breadcrumb';
import { Form, message, Input } from 'antd';

@inject('pushStore')
@observer
class PushCreateForm extends React.Component<PushProps,any> {

    pushStore;
    id;

    constructor(props: PushProps) {
        super(props);
        this.pushStore = this.props.pushStore;
        this.id = this.props.match.params.id;
    }

    resetPushCreateParams() {
        this.pushStore.setPushCreateParam({
            submitting: false,
            pushInfo: {
                appKey : '',
                appSecret : '',
                title : '',
                url : '',
            }
        });
    }

    componentDidMount() {
        if (this.id) {
            this.pushStore.getPushInfo(this.id);
        } else {
            this.resetPushCreateParams();
        }
    }

    componentWillReceiveProps(nextProps: any) {
        this.id = nextProps.match.params.id;
        if (this.id) {
            this.pushStore.getPushInfo(this.id);
        } else {
            this.resetPushCreateParams();
        }
    }

    /**
     * save
     * @return {}       []
     */
    handleValidSubmit(e: any) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.pushStore.setPushCreateParam({submitting: true});
                if (this.id) {
                    values.id = this.id;
                }
                this.pushStore.savePush(values).then(() => {
                    setTimeout(() => this.props.history.push('/push/list'), 1000);
                });
            }
        });
    }

    /**
     * render
     * @return {} []
     */
    render() {
        const FormItem = Form.Item;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xl: { span: 2 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xl: { span: 8 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xl: {
                    span: 16,
                    offset: 1,
                }
            },
        };
        const { pushInfo } = this.pushStore.pushCreateParam;
        let props = {};
        if (this.pushStore.pushCreateParam.submitting) {
            props.disabled = true;
        }

        return (
            <div className="fk-content-wrap">
                <BreadCrumb {...this.props} />
                <div className="manage-container">
                    <Form
                        className="tag-create clearfix"
                        onSubmit={this.handleValidSubmit.bind(this)}
                    >
                        <div className="alert alert-info" role="alert" style={{maxWidth: '700px'}}>
                            ????????????????????????????????????????????????????????????????????????????????? Firekylin ???????????????????????????
                            ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                            ???????????????????????????????????????
                        </div>
                        <FormItem label="????????????" {...formItemLayout}>
                            {getFieldDecorator('title', {
                                rules: [{
                                        required: true,
                                        message: '?????????????????????!'
                                    }],
                                initialValue: pushInfo.title ? pushInfo.title : '',
                            })(<Input placeholder="?????????????????????" />)}
                        </FormItem>
                        <FormItem label="????????????" {...formItemLayout}>
                            {getFieldDecorator('url', {
                                rules: [{
                                    required: true,
                                    message: '?????????????????????!'
                                }],
                                initialValue: pushInfo.url ? pushInfo.url : '',
                            })(<Input placeholder="?????????????????????" />)}
                        </FormItem>
                        <FormItem label="????????????" {...formItemLayout}>
                            {getFieldDecorator('appKey', {
                                rules: [{
                                    required: true,
                                    message: '?????????????????????!'
                                }],
                                initialValue: pushInfo.appKey ? pushInfo.appKey : '',
                            })(<Input placeholder="?????????????????????" />)}
                        </FormItem>
                        <FormItem label="????????????" {...formItemLayout}>
                            {getFieldDecorator('appSecret', {
                                rules: [{
                                    required: true,
                                    message: '?????????????????????!'
                                }],
                                initialValue: pushInfo.appSecret ? pushInfo.appSecret : '',
                            })(<Input placeholder="?????????????????????" />)}
                        </FormItem>
                        <FormItem  {...tailFormItemLayout}>
                            <button type="submit" {...props} className="btn btn-primary">
                                {this.pushStore.pushCreateParam.submitting ? '?????????...' : '??????'}
                            </button>
                        </FormItem>
                </Form>
                </div>
            </div>
    );
    }
}
const PushCreate = Form.create()(PushCreateForm);
export default PushCreate;
