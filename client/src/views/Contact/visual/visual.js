import React, { Component } from 'react'
import {Button, Row, Col, Fade, Card} from 'reactstrap';
import { Link } from 'react-router-dom';
import * as d3 from "d3";
import { ForceGraph2D } from 'react-force-graph';
import axios from 'axios';

function brgba(hex, opacity) {
    if( ! /#?\d+/g.test(hex) ) return hex; 
    var h = hex.charAt(0) === "#" ? hex.substring(1) : hex,
        r = parseInt(h.substring(0,2),16),
        g = parseInt(h.substring(2,4),16),
        b = parseInt(h.substring(4,6),16),
        a = opacity;
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
} 
  
//For D3 test
export class visual extends Component {
    constructor(props) {
        super(props);
        this.handleNodeHover = this.handleNodeHover.bind(this);
        this.paintNode = this.paintNode.bind(this);
        this.state ={
            data: { nodes: [], links: [] },
            width: 1400,
            height: 600,
            highlightNodes: [],
            highlightLinks:[],
            baseNodes: [],
            baseLinks: []
        }

    }
    componentDidMount() {
        
        this.fg.d3Force('charge', d3.forceManyBody().strength(-50));
        this.fg.d3Force('center', d3.forceCenter());
        this.fg.d3Force('collide', d3.forceCollide().radius(5));
        this.fg.d3Force('link', d3.forceLink().distance(function (link) { return (1/link.strength) * 30 }))
        var nodes = [{ id: "Grouping", group: 0, label: "Grouping", level: 1}];
        var links = [];
        axios.get(`contacts/getcontact/${localStorage.contactId}`)
        .then(res => {
            console.log(res.data)
            var contact = res.data;
            contact.forEach(contact => {
                var name = `${contact.firstName} ${contact.lastName}`
                nodes.push({ id: name, group: 2, label: name, level: 1 })
            })
            this.setState({
                data: { nodes: [...nodes], links: [...links] },
            })
        })
        axios.get(`groups/getgroup/${localStorage.groupId}`)
        .then(res => {
            var group = res.data;
            console.log(res.data)
            group.forEach(group => {
                var GroupName = group.GroupName;
                nodes.push({ id: GroupName, group: 1, label: GroupName, level: 1 })
                
                group.name.forEach(name => {
                    links.push({target:name, source:GroupName, strength:0.2})
                })
                links.push({target:GroupName, source:'Grouping', strength:0.3})
            })
            this.setState({
                data: { nodes: [...nodes], links: [...links] },
                baseLinks: [...links]
            })
        })
        
    }

    handleNodeHover = node => {
        var connect = [];
        var related = [node]
        if (node){
            [...this.state.baseLinks].forEach(link => {
                if (link.source === node ||link.target === node){
                    connect.push(link)
                    related.push(link.source === node? link.target :link.source)
                }
            })
            if (connect.length === 0){
                connect.push({target:node, source:node, strength:1})
            }
        }

        this.setState({
            highlightLinks: connect,
            highlightNodes: node ? related: [],
        })
    }

    paintNode = node => {
        if (this.state.highlightNodes.length === 0){
            return node.color
        } else {
            if (this.state.highlightNodes.indexOf(node) !== -1) {
                return node.color
            }  else {
                return brgba(node.color, 0.2)
            }
        }};
    
    render() {
        return (
            
            <div className="animated fadeIn">
                <Row>
                <Col>
                    <Link to="/contact" className='back-btn mt-1'><Button color="primary"  className="mr-3 "><i className='fa fa-arrow-left mr-1'></i> Back</Button></Link>

                    <h1 className="h3 mb-3 text-gray-800">Visual Display</h1>
                    <Fade timeout={200} in={true}>
                        <Card className="card-accent-info shadow-sm">
                            <Row>
                                <Col>
                                <ForceGraph2D
                                ref={el => this.fg = el}
                                graphData={this.state.data}
                                height = {600}
                                width = {1400}
                                linkWidth={(link)=> this.state.highlightLinks.indexOf(link) !== -1 ?2.5:1.5}
                                linkColor={(link) => {
                                    if (this.state.highlightLinks.length === 0){
                                        return 'rgba(115, 129, 143, 1)'
                                    } else {
                                    return this.state.highlightLinks.indexOf(link) !== -1 ? 'rgba(115, 129, 143, 1)':'rgba(200, 206, 211,0.5)'}}
                                }
                                linkDirectionalParticles={3}
                                linkDirectionalParticleWidth={1.2}
                                linkDirectionalParticleColor = {(link)=> this.state.highlightLinks.indexOf(link) !== -1 ?'rgba(255,255,255,1)':undefined}
                                d3AlphaDecay = {0.05}
                                d3VelocityDecay = {0.4}
                                nodeAutoColorBy="group"
                                onNodeHover={this.handleNodeHover}
                                nodeOpacity = {0}
                                // nodeCanvasObjectMode={node => highlightNodes.indexOf(node) !== -1 ? 'before' : undefined}
                                nodeCanvasObject={(node, ctx, globalScale) => {
                                const label = node.id;
                                const fontSize = (20 - node.group * 2)/globalScale;
                                ctx.font = `${fontSize}px Sans-Serif `;
                                const textWidth = ctx.measureText(label).width;
                                const bckgDimensions = [textWidth, fontSize].map(n => n ); // some padding
                                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                                ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = this.paintNode(node);
                                ctx.fillText(label, node.x, node.y);
                                }}/>
                                </Col>
                            </Row>
                        </Card>
                    </Fade>
                </Col>
                </Row>
            </div>
        )
    }
}

export default visual
