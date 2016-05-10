require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
let imagesData = require('json!../data/imagesData.json');

// 载入图片url
imagesData.forEach(function (item) {
	item.imgUrl = require('../images/' + item.fileName);
});
/**
 * 获取区间内的随机值
 */
function getRangeRandom(low,high) {
	return Math.ceil(Math.random() * (high - low) + low);
}
function getLimitRangeRandom(start,end,removeStart,removeEnd) {
	var result = 0;
	do{
		result = Math.ceil( Math.random() * (end - start) + start );
	}while( result > removeStart && result < removeEnd );
	return result;
	// return Math.ceil( Math.random() * (end - start) + start );
}
/**
 * 获取[-30,30]度之间的值
 */
function get30degRandom() {
	return Math.ceil(Math.random() * 60 - 30);
}
let ImgFigure = React.createClass({
	// 点击 调用翻转
	handleClik: function(e) {
	  if (this.props.arrange.isCenter) {
	    this.props.inverse();
	  } else {
	    this.props.center();
	  }
	  e.stopPropagation();
	  e.preventDefault();

	},
	render (){
		let styleObj = {};
		// 设置位置
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}
		if (this.props.arrange.rotate) {
			(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function (item) {
				styleObj[ item ] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this))
		}
		var imgFiguresClassName = 'img-figure';
				if (this.props.arrange.isInverse) {
					imgFiguresClassName += ' is-inverse';
				}
		return (
			<figure className={imgFiguresClassName} ref="figure" style={styleObj}>
				<img src={this.props.data.imgUrl} alt={this.props.data.title} onClick={this.handleClik}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClik}>{this.props.data.desc}</div>
				</figcaption>
			</figure>
		);
	}
});


let GalleryByReactApp = React.createClass({
	Constant : {
			// 图片初始状态
			centerPos:{
				left:0,
				right:0
			},
			// 图片摆放区域
			imgPosRange:{
				x:[0,0],
				y:[0,0]
			},
			// 中心区域
			centerPosRange:{
				x:[0,0],
				y:[0,0]
			}
	},
  getInitialState: function () {
    return {
        imgsArrangeArr: [
            /*{
                pos: {
                    left: '0',
                    top: '0'
                },
                rotate: 0,    // 旋转角度
                isInverse: false,    // 图片正反面
                isCenter: false,    // 图片是否居中
            }*/
        ]
    };
  },

	// 计算图片的位置;
	componentDidMount  () {
		// 舞台大小;
		var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
				stageW = stageDOM.scrollWidth,
				stageH = stageDOM.scrollHeight,
				halfStageW = Math.ceil(stageW / 2),
				halfStageH = Math.ceil(stageH / 2);
		// 图片大小;
		var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigures0),
				imgW = imgFigureDOM.scrollWidth,
				imgH = imgFigureDOM.scrollHeight,
				halfImgW = Math.ceil(imgW / 2),
				halfImgH = Math.ceil(imgH / 2);
		// 中心图片坐标
		this.Constant.centerPos = {
			left:halfStageW - halfImgW,
			top:halfStageH - halfImgH
		};
		// 中心区域的范围
		this.Constant.centerPosRange.leftSecX = halfStageW - halfImgW * 3;
		this.Constant.centerPosRange.rightSecX = halfStageW + halfImgW;
		this.Constant.centerPosRange.topSecY = halfStageH - halfImgH * 3;
		this.Constant.centerPosRange.bottomSecY = halfStageH + halfImgH;
		// 摆放图片范围
		this.Constant.imgPosRange.leftSecX = -halfImgW;
		this.Constant.imgPosRange.rightSecX = stageW - halfImgW;
		this.Constant.imgPosRange.topSecY = -halfImgH;
		this.Constant.imgPosRange.bottomSecY = stageH - halfImgH;
		this.rearrange(0);
	},
	/**
	 * 图片翻转
	 * @param  {Number} index 被点击图片的标号
	 */
	inverse:function (index) {
		return function () {
			var imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr:imgsArrangeArr
			});
		}.bind(this);
	},
	/**
	 * 居中被点击的图片
	 * @param  {Number} index 被点击的图片标号
	 */
	center:function (index) {
		return function () {
			this.rearrange(index);
		}.bind(this)	;
	},
	/**
	 * [rearrange 重新布局所有图片]
	 * @param  {Number} centerIndex 中心图片
	 */
	rearrange (centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr;
		var Constant = this.Constant;
		var centerPos = Constant.centerPos;
		var imgPosRange = Constant.imgPosRange;
		var centerPosRange = Constant.centerPosRange;

				// 图片摆放区域
		var imgPosRangeX = [imgPosRange.leftSecX,imgPosRange.rightSecX];
		var imgPosRangeY = [imgPosRange.topSecY,imgPosRange.bottomSecY];
				// 中心区域
		var centerPosRangeX = [centerPosRange.leftSecX,centerPosRange.rightSecX];
		// var centerPosRangeY = [centerPosRange.topSecY,centerPosRange.bottomSecY];
				// 取得中心图片
		var	imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
				// 居中 centerIndex 图片
				imgsArrangeCenterArr[0] = {
				  pos: centerPos,
				  rotate: 0,
				  isCenter: true
				}
				// 布局其他图片
				imgsArrangeArr.forEach(function (item) {
					item.pos = {
						left: getLimitRangeRandom(imgPosRangeX[0],imgPosRangeX[1],centerPosRangeX[0],centerPosRangeX[1]),
						top:getRangeRandom(imgPosRangeY[0],imgPosRangeY[1])
					};
					item.rotate = get30degRandom();
					item.isCenter = false;
				});
				imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
				this.setState({
					imgsArrangeArr:imgsArrangeArr
				});
	},
	render (){
		// 图片,控制数据
		let controllerUnits = [];
		let imgFigures = [];

		imagesData.forEach(function (item,index) {
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse:false,
					isCenter:false
				}
			}
			imgFigures.push(<ImgFigure data={item} key={index}  ref={'imgFigures' +  index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
		}.bind(this));
		return (
	    <section className="stage" ref="stage">
	    	<section className="img-sec">
	    		{imgFigures}
	    	</section>
	    	<nav className="controller-nav">
	    		{controllerUnits}
	    	</nav>
	    </section>
  );
	}
});

let ControllerUnit = React.createClass({
	handleClick:function (e) {
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.preventDefault();
		e.stopPropagation();
	},
	render:function () {
		var controllerUnitClassName = 'controller-unit';
		if (this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center';
			if (this.props.arrange.isInverse) {
			controllerUnitClassName += ' is-inverse';
			}
		}
		return (
			 <span className={controllerUnitClassName} onClick={this.handleClick}></span>
		);
	}
})


GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
