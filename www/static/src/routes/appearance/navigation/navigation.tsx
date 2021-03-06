import { Input, Divider, Button, message } from 'antd';
import React from 'react';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import 'antd/lib/table/style/index';
import BreadCrumb from '../../../components/breadcrumb';
@inject('sharedStore', 'navigationStore', 'optionsImportStore')
@observer
class Navigation extends React.Component<any, any> {
    state = this.initialState();
    columns: any[] = [];

    initialState() {
        const options = window.SysConfig.options;
        if (!options.navigation) {
            options.navigation = [];
        } else if (typeof(options.navigation) === 'string') {
            options.navigation = JSON.parse(options.navigation);
        }
        options.navigation = options.navigation.map((item, key) => {
            if (!item) {
                return;
            }
            item.key = key.toString();
            return item;
        });
        return {
            list: options.navigation,
            editingRow: -1,
            editingNav: {
                label: '',
                url: '',
                option: ''
            },
            hasError: {
                label: false,
                url: false,
                option: false,
                new: false,
            },
            row: {
                label: '',
                url: '',
                option: '',
            }
        };
    }

    constructor(props: any) {
        super(props);
    }
    componentDidMount() {
        // 
    }

    normalRow(nav: any, i: number) {
        return (
            <tr
                key={i.toString()}
                className="fk-dragable-row"
            >
                <td>{nav.label}</td>
                <td>{nav.url}</td>
                <td>{nav.option}</td>
                <td>
                <Button 
                        disabled={i === 0}
                        onClick={() => this.move(i - 1, i)}
                        className="ant-btn-success"
                        size="small" 
                        icon="arrow-up"
                    >
                        ??????
                    </Button>
                    <Divider type="vertical" />
                    <Button 
                        disabled={i === this.state.list.length - 1}
                        onClick={() => this.move(i, i + 1)}
                        className="ant-btn-success"
                        type="primary" 
                        size="small" 
                        icon="arrow-down"
                    >
                        ??????
                    </Button>
                    <Divider type="vertical" />
                    <Button 
                        onClick={() => this.setState({editingRow: i, editingNav: Object.assign({}, nav)})}
                        type="primary" 
                        size="small" 
                        icon="edit"
                    >
                        ??????
                    </Button>
                    <Divider type="vertical" />
                    <Button 
                        onClick={() => this.delete(i)}
                        type="danger" 
                        size="small" 
                        icon="delete"
                    >
                        ??????
                    </Button>
                </td>
            </tr>
        );
    }
    
    editingRow(nav: any, i: number) {
        const { editingNav } = this.state;
        return (
          <tr
            key={`editing-${i}`}
            className="fk-dragable-row"
          >
            <td>
                <Input 
                    value={this.state.editingNav.label}
                    type="text"
                    name="label"
                    className={classNames({'has-error': this.state.hasError.label})}
                    onChange={e => {
                        editingNav.label = e.target.value;
                        this.setState({editingNav});
                        if (e.target.value !== '') {
                            this.setHasError('label', false);
                        } else {
                            this.setHasError('label', true);
                        }
                    }} 
                />
            </td>
            <td>
                <Input 
                    value={this.state.editingNav.url}
                    type="text"
                    name="label"
                    className={classNames({'has-error': this.state.hasError.url})}
                    onChange={e => {
                        editingNav.url = e.target.value;
                        this.setState({editingNav});
                        if (e.target.value !== '') {
                            this.setHasError('url', false);
                        } else {
                            this.setHasError('url', true);
                        }
                    }} 
                />
            </td>
            <td>
                <Input 
                    value={this.state.editingNav.option}
                    type="text"
                    name="option"
                    className={classNames({'has-error': this.state.hasError.option})}
                    onChange={e => {
                        editingNav.option = e.target.value;
                        this.setState({editingNav});
                        if (e.target.value !== '') {
                            this.setHasError('option', false);
                        } else {
                            this.setHasError('option', true);
                        }
                    }} 
                />
            </td>
            <td>
                <a 
                    onClick={() => {
                        if (editingNav.label && editingNav.url && editingNav.option) {
                            this.edit(this.state.editingRow, this.state.editingNav);
                            this.setState({editingRow: -1, editingNav: null});
                        }
                    }}
                >
                    ??????
                </a>
                <Divider type="vertical" />
                <a 
                    onClick={() => {
                        this.setState({editingRow: -1, editingNav: null});
                    }}
                >
                    ??????
                </a>
            </td>
          </tr>
        );
    }

    move(a: number, b: number) {
        let c = this.state.list[a];
        this.state.list[a] = this.state.list[b];
        this.state.list[b] = c;
        this.updateNav('????????????');
    }

    edit(idx: any, nav: any) {
        const { list } = this.state;
        list[idx] = nav;
        this.updateNav('????????????');
    }

    delete(key: number) {
        const list = this.state.list.filter((item => item.key !== key.toString()));

        this.updateNav('????????????', list);
    }

    add() {
        if (!this.state.row.label || !this.state.row.url || !this.state.row.option) {
            this.setHasError('new', true);
            return;
        }
        this.state.list.push(this.state.row);
        this.updateNav('????????????');
        this.resetRow();
    }

    resetRow() {
        this.setState({row: {
            label: '',
            url: '',
            option: ''
        }});
    }

    setHasError(key: string, error: boolean) {
        this.setState({hasError: Object.assign({}, this.state.hasError, {[key]: error})});
    }

    updateNav(messageText: string, data?: any) {
        let list = data || this.state.list;
        this.props.navigationStore.update(list)
        .subscribe(
            res => {
                if (res.errno === 0) {
                    message.success(messageText);
                    list = list.map((item, key) => {
                        if (!item) {
                            return;
                        }
                        item.key = key.toString();
                        return item;
                    });
                    window.SysConfig.options.navigation = list;
                    this.setState({list: list});
                }
            },
            err => {
                message.error(err);
            }
        );
    }

    render() {
        const rows = this.state.list.map((nav, i) => {
            if (!nav) {
                return null;
            }
            return this.state.editingRow !== i ? this.normalRow(nav, i) : this.editingRow(nav, i);
        });

        rows.push(
            <tr key="form">
                <td>
                    <Input 
                        value={this.state.row.label}
                        type="text"
                        name="label"
                        className={classNames({'has-error': this.state.hasError.new})}
                        onChange={e => {
                            this.setState({row: Object.assign({}, this.state.row, {label: e.target.value})});
                            if (e.target.value !== '') {
                                this.setHasError('new', false);
                            } else {
                                this.setHasError('new', true);
                            }
                        }} 
                    />
                </td>
                <td>
                    <Input 
                        value={this.state.row.url}
                        type="url"
                        name="label"
                        className={classNames({'has-error': this.state.hasError.new})}
                        onChange={e => {
                            this.setState({row: Object.assign({}, this.state.row, {url: e.target.value})});
                            if (e.target.value !== '') {
                                this.setHasError('new', false);
                            } else {
                                this.setHasError('new', true);
                            }
                        }} 
                    />
                </td>
                <td>
                    <Input 
                        value={this.state.row.option}
                        type="option"
                        name="label"
                        className={classNames({'has-error': this.state.hasError.new})}
                        onChange={e => {
                            this.setState({row: Object.assign({}, this.state.row, {option: e.target.value})});
                            if (e.target.value !== '') {
                                this.setHasError('new', false);
                            } else {
                                this.setHasError('new', true);
                            }
                        }} 
                    />
                </td>
                <td>
                    <Button 
                        onClick={() => this.add()}
                        type="primary" 
                        size="small" 
                        icon="plus"
                    >
                        ??????
                    </Button>
                </td>
            </tr>
        );
        return (
            <div>
                <BreadCrumb {...this.props} />
                <div className="options-import-rss-page page-list">
                    <table className="ant-table ant-table-bordered" style={{width: '100%'}}>
                        <thead className="ant-table-thead">
                            <tr>
                                <th>????????????</th>
                                <th>????????????</th>
                                <th>????????????</th>
                                <th>??????</th>
                            </tr>
                        </thead>
                        <tbody className="ant-table-tbody" children={rows} />
                    </table>
                </div>
            </div>
        );
    }
}

export default Navigation;