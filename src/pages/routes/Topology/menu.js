import React from 'react';

const Layout = ({ Tools, onDrag }) => {
  return Tools.map((item, index) => (
    <div key={index}>
      <div className="title">{item.group}</div>
      <div className="button">
        {item.children.map((item, idx) => {
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          return (
            <a
              key={idx}
              title={item.name}
              draggable
              href="/#"
              style={{ display:'inline-block', width:'30px', height:'30px'}}
            //   onDragStart={(ev) => onDrag(ev, item)}
                onDragStart={(e)=>{
                    console.log(e);
                }}
            >
              <i className={'iconfont ' + item.icon} style={{ fontSize: 13 }}></i>
            </a>
          );
        })}
      </div>
    </div>
  ));
};

export default Layout;
