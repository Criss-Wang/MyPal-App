import React, {Component} from 'react';
// Note that the Pushing Sequence for the List is Reversed because of the float:right Styling.
class Pagecomponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: 1, 
            groupCount: 4, 
            startPage: 1,  
            totalPage:10,
            itemsPerpage:10, 
            totalItem: 500,
            //random variable assignment for initialization
        }
        this.createNav = this.createNav.bind(this);
    }

    // set the value to those passed from parent component
    componentDidMount() {
        this.setState({
            totalItem: this.props.totalItem,
            currentPage: this.props.currentPage,
            itemsPerpage : this.props.itemsPerpage,
            totalPage: this.props.totalPage
        })
    }

    componentDidUpdate(){
        if(this.state.totalItem !== this.props.totalItem ||
            this.state.currentPage !== this.props.currentPage ||
            this.state.itemsPerpage !== this.props.itemsPerpage ||
            this.state.totalPage !== this.props.totalPage){
            this.setState({
                totalItem: this.props.totalItem,
                currentPage: this.props.currentPage,
                itemsPerpage : this.props.itemsPerpage,
                totalPage: this.props.totalPage
            })
        }
    }

    // Create the pagination display
    createNav() {
        const {currentPage, groupCount, totalPage} = this.state;
        var {startPage} = this.state;
        let pages = []

        //Next page button
        pages.push(<li className={currentPage === totalPage ? "nomore" : null}
                       onClick={this.nextPageHandeler.bind(this)}
                       key={totalPage + 1}><i className='fa fa-chevron-right'></i></li>)

        if (totalPage <= 6) {
            /*Display all if totalpage <=6 */
            for (let i = totalPage; i >= 1; i--) {
                pages.push(<li key={i} onClick={this.pageClick.bind(this, i)}
                               className={currentPage === i ? "activePage" : null}>{i}</li>)
            }
        } else {
            /*Display partial if totalpage <=6*/

            //Last Page button
            pages.push(<li className={currentPage === totalPage ? "activePage" : null} key={totalPage}
                           onClick={this.pageClick.bind(this, totalPage)}>{totalPage}</li>)
            
            //Ellipsis for the ignored (back one)
            if (startPage + groupCount < totalPage) {
                pages.push(<li className="ign" key={-2}>···</li>)
            }

            // Adjust innerLast  
            let innerLast = 0;
            if (currentPage < groupCount + 1){
                innerLast = groupCount + 1;
                startPage = 2;
            } else {
                innerLast = groupCount + startPage -1;}

            if (startPage + groupCount >= totalPage) {
                innerLast = totalPage -1;
                startPage = totalPage - groupCount;
            } else {
                innerLast = groupCount + startPage -1;
            }
            
            //Inner display
            for (let i = innerLast ; i >= startPage; i--) {
                if (i <= totalPage - 1 && i > 1) {
                    pages.push(<li className={currentPage === i ? "activePage" : null} key={i}
                                   onClick={this.pageClick.bind(this, i)}>{i}</li>)
                }
            }

            if (currentPage >= groupCount + 1){
                pages.push(<li className="ign" key={-1}>···</li>)
            }//Ellipsis for the ignored (front one)

            //First Page button
            pages.push(<li className={currentPage === 1 ? "activePage" : null} key={1}
                           onClick={this.pageClick.bind(this, 1)}>1</li>)
        }
            //Prev page Button
        pages.push(<li className={currentPage === 1 ? "nomore" : null} onClick={this.prePageHandeler.bind(this)}key={0}><i className='fa fa-chevron-left'></i></li>)
        
        return pages;

    }

    //Page Click
    pageClick(clickedPage) {
        const {groupCount} = this.state
        const getCurrentPage = this.props.paginate;
        if (clickedPage-1 >= groupCount) {
            this.setState({
                startPage: clickedPage - 2,
            })
        }
        if (clickedPage-1 < groupCount) {
            this.setState({
                startPage: 1,
            })
        }
        if (clickedPage === 1) {
            this.setState({
                startPage: 1,
            })
        }
        this.setState({
            currentPage: clickedPage,
        })
        //Return Current Page to parent component
        getCurrentPage(clickedPage)
    }

    //Prev page handler
    prePageHandeler() {
        let {currentPage} = this.state
        if (--currentPage === 0) {
            return false
        }
        this.pageClick(currentPage)
    }

    //Next Page handler
    nextPageHandeler() {
        let {currentPage,totalPage} = this.state
        if (++currentPage > totalPage) {
            return false
        }
        this.pageClick(currentPage)
    }
    
    render() {
        const pageList = this.createNav();
        return (
            <ul className="page-container">
                {pageList}
            </ul>
        )
    }
}

export default Pagecomponent