const http = require('http');
const url = require('url');
const fs = require('fs');
const PORT = 3030;

//Cache some core info server can hold.
const productLinkBtn = fs.readFileSync(`${__dirname}/templates/product_link.html`, 'utf-8');
const mainPage = fs.readFileSync(`${__dirname}/templates/main.html`, 'utf-8');
const productItem = fs.readFileSync(`${__dirname}/templates/product_item.html`, 'utf-8');
const productPage = fs.readFileSync(`${__dirname}/templates/products.html`, 'utf-8');

//Methods
const replaceInfo = (page, product, type = 'drinks') => {
    let output = page.replace(/{PRODUCTNAME}/g, product.productName);
    output = output.replace(/{PRICE}/g, product.price);
    output = output.replace(/{FROM}/g, product.from);
    output = output.replace(/{QUANTITY}/g, product.quantity);
    output = output.replace(/{ID}/g, product.id);
    output = output.replace(/{PRODUCT_TYPE}/g, type);
    return output;
}

const productPageInfo = (data, type) => {
    const dataObj = JSON.parse(data);

    const productionLinks = dataObj.map(el => {
        let output = replaceInfo(productLinkBtn, el, type);
        return output;
    }).join("");

    let output = productPage.replace('{PRODUCTLINKS}', productionLinks);
    output = output.replace(/{PRODUCT_TYPE}/g, type)
    return output;
}

const productItemInfo = (data, query, type) => {
    const dataObj = JSON.parse(data);
    const product = dataObj[query.id];
    let output = replaceInfo(productItem, product, type);

    if (query.showDescription === 'true')
        output = output.replace('{DESCRIPTION}', product.description)
    else
        output = output.replace('{DESCRIPTION}', "");

    return output;
}

//Server
http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);
    
    if (pathname === '/main'|| pathname === '/') {
        res.writeHead(200, 'Working', { 'content-type': 'text/html' })
        res.write(mainPage);
        res.end();

    } else if (pathname === '/products/veggies') {
        fs.readFile('data/veggies.json', (err, data) => {
            if (err) {
                res.writeHead(404, { "content-type": 'text/html' })
                res.write(`Something went wrong with request ${err}`);
                res.end();
            }
            else {
                res.writeHead(200, 'Working', { 'content-type': 'text/html' })
                if (query.id)
                    res.write(productItemInfo(data, query, 'veggies'))
                else
                    res.write(productPageInfo(data, 'veggies'));

                res.end();
            }
        })
    }
    else if (pathname === '/products/drinks') {
        fs.readFile('data/drinks.json', (err, data) => {
            if (err) {
                res.writeHead(404, { "content-type": 'text/html' })
                res.write(`Something went wrong with request ${err}`);
                res.end();
            }
            else {
                res.writeHead(200, 'Working', { 'content-type': 'text/html' })
                if (query.id)
                    res.write(productItemInfo(data, query, 'drinks'))
                else
                    res.write(productPageInfo(data, 'drinks'));

                res.end();
            }
        })
    }
    else if (pathname === '/products/snacks') {
        fs.readFile('data/snacks.json', (err, data) => {
            if (err) {
                res.writeHead(404, { "content-type": 'text/html' })
                res.write(`Something went wrong with request ${err}`);
                res.end();
            }
            else {
                res.writeHead(200, 'Working', { 'content-type': 'text/html' })
                if (query.id)
                    res.write(productItemInfo(data, query, 'snacks'))
                else
                    res.write(productPageInfo(data, 'snacks'));

                res.end();
            }
        })
    }
    else if (pathname === '/products/frozen') {
        fs.readFile('data/frozen.json', (err, data) => {
            if (err) {
                res.writeHead(404, { "content-type": 'text/html' })
                res.write(`Something went wrong with request ${err}`);
                res.end();
            }
            else {
                res.writeHead(200, 'Working', { 'content-type': 'text/html' })
                if (query.id)
                    res.write(productItemInfo(data, query, 'frozen'))
                else
                    res.write(productPageInfo(data, 'frozen'));

                res.end();
            }
        })
    }
    else {
        res.writeHead(404, { 'content-type': 'text/html' });
        res.write("page doesn't exist");
        res.end();
    }

}).listen(PORT, () => console.log(`Started server and listening on port:${PORT}`))


