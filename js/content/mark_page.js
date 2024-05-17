const customCSS = `
    ::-webkit-scrollbar {
        width: 10px;
    }
    ::-webkit-scrollbar-track {
        background: #27272a;
    }
    ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 0.375rem;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
`;

const styleTag = document.createElement("style");
styleTag.textContent = customCSS;
document.head.append(styleTag);

let labels = [];

function unmarkPage() {
  // Unmark page logic
  for (const label of labels) {
    document.body.removeChild(label);
  }
  labels = [];
}

function getXPathTo(element) {
  if (element.id !== '')
    return 'id("' + element.id + '")';
  if (element === document.body)
    return element.tagName;

  var ix = 0;
  var siblings = element.parentNode.childNodes;
  for (var i = 0; i < siblings.length; i++) {
    var sibling = siblings[i];
    if (sibling === element)
      return getXPathTo(element.parentNode) + '/' + element.tagName + '[' + (ix + 1) + ']';
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName)
      ix++;
  }
}

function markPage() {
  unmarkPage();

  let bodyRect = document.body.getBoundingClientRect();

  // Get all elements on the page and filter out the ones that are not clickable
  let items = Array.prototype.slice
    .call(document.querySelectorAll("*"))
    .map(function (element, index) {
      let vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      let vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      );
      let textualContent = element.textContent.trim().replace(/\s{2,}/g, " ");
      let elementType = element.tagName.toLowerCase();
      let ariaLabel = element.getAttribute("aria-label") || "";
      let placeholder = element.getAttribute("placeholder") || "";
      let label = ""; // Initialize label variable

      // Check if the element has a label associated with it
      const labelElement = element.closest("label");
      if (labelElement) {
        label = labelElement.textContent.trim();
      }

      // save xpath of the element
      path = getXPathTo(element);

      let rects = [...element.getClientRects()]
        .filter((bb) => {
          let center_x = bb.left + bb.width / 2;
          let center_y = bb.top + bb.height / 2;
          let elAtCenter = document.elementFromPoint(center_x, center_y);

          return elAtCenter === element || element.contains(elAtCenter);
        })
        .map((bb) => {
          const rect = {
            left: Math.max(0, bb.left),
            top: Math.max(0, bb.top),
            right: Math.min(vw, bb.right),
            bottom: Math.min(vh, bb.bottom),
          };
          return {
            ...rect,
            width: rect.right - rect.left,
            height: rect.bottom - rect.top,
          };
        });

      let area = rects.reduce((acc, rect) => acc + rect.width * rect.height, 0);

      return {
        element: element,
        path: path,
        include:
          element.tagName === "INPUT" ||
          element.tagName === "TEXTAREA" ||
          element.tagName === "SELECT" ||
          element.tagName === "BUTTON" ||
          element.tagName === "A" ||
          element.onclick != null ||
          window.getComputedStyle(element).cursor == "pointer" ||
          element.tagName === "IFRAME" ||
          element.tagName === "VIDEO",
        area,
        rects,
        text: textualContent,
        type: elementType,
        ariaLabel: ariaLabel,
        placeholder: placeholder,
        label: label, // Assign label to the item
      };
    })
    .filter((item) => item.include && item.area >= 20);

  // Only keep inner clickable items 
  items = items.filter(
    (x) => !items.some((y) => x.element.contains(y.element) && !(x == y))
  );

  const clickableItems =
    items.map((item) => ({
      text: item.text,
      type: item.type,
      ariaLabel: item.ariaLabel,
      path: item.path,
      placeholder: item.placeholder,
      label: item.label,
      type: item.type,
    }));

  // Lets create a floating border on top of these elements that will always be visible
  items.forEach(function (item, index) {
    item.rects.forEach((bbox) => {
      newElement = document.createElement("div");
      const borderColor = "#00FF00";
      newElement.style.outline = `2px solid ${borderColor}`;
      newElement.style.position = "fixed";
      newElement.style.left = bbox.left + "px";
      newElement.style.top = bbox.top + "px";
      newElement.style.width = bbox.width + "px";
      newElement.style.height = bbox.height + "px";
      newElement.style.pointerEvents = "none";
      newElement.style.boxSizing = "border-box";
      newElement.style.zIndex = 2147483647;

      document.body.appendChild(newElement);
      labels.push(newElement);
    });
  });

  // console.log(clickableItems);
  return clickableItems;
}


function getElementsTree(items) {
  const elements = [];

  items.forEach(item => {
    const { path, text, type, ariaLabel, placeholder, label, altText, clickable, id } = item;

    // If the path is a direct child of the root
    if (!path.includes('/')) {
      elements.push({ path, text, type, ariaLabel, placeholder, label, altText, clickable, children: [] });
    } else {
      const lastSlashIndex = path.lastIndexOf('/');
      const parentPath = path.substring(0, lastSlashIndex);
      const childPath = path.substring(lastSlashIndex + 1);

      const parentElement = elements.find(element => element.path === parentPath);
      // console.log(parentElement);

      if (parentElement) {
        parentElement.children.push({
          path: path, text, type, ariaLabel, placeholder, label, altText, clickable, children: []
        });
      } else {
        elements.push({
          path: parentPath,
          children: [{
            path: path, text, type, ariaLabel, placeholder, label, altText, clickable, children: []
          }]
        });
      }
    }
  });

  elements.forEach(element => {
    // if element only contain one child, then replace the parent element with the child
    if (element.children.length === 1) {
      const child = element.children[0];
      element.path = `${element.path}/${child.path}`
      element.text = child.text;
      element.type = child.type;
      element.ariaLabel = child.ariaLabel;
      element.placeholder = child.placeholder;
      element.label = child.label;
      element.altText = child.altText;
      element.clickable = child.clickable;
      element.children = child.children;
      // element.id = child.id;
    }
  });

  elements.forEach(element => {
    // if children array is empty or ariaLabel is empty or placeholder is empty or label is empty or altText is empty or text is empty, remove the key
    if (element.children.length === 0) {
      delete element.children;
    }
    if (element.ariaLabel === "") {
      delete element.ariaLabel;
    }
    if (element.placeholder === "") {
      delete element.placeholder;
    }
    if (element.label === "") {
      delete element.label;
    }
    if (element.altText === "") {
      delete element.altText;
    }
    if (element.text === "") {
      delete element.text;
    }
  });

  return elements;
}




function getClickableAndTextualContent() {
  // let bodyRect = document.body.getBoundingClientRect();

  // Get all elements on the page and filter out the ones that are not clickable or have no textual content
  let items = Array.prototype.slice
    .call(document.querySelectorAll("*"))
    .map(function (element, index) {
      let vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      let vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      );
      // take elements which are visibles in the screen currently
      let rect = element.getBoundingClientRect();
      let isVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= vh &&
        rect.right <= vw;

      // if the element display is none or visibility is hidden, remove it
      if (window.getComputedStyle(element).display === "none" || window.getComputedStyle(element).visibility === "hidden") {
        console.log("Element is not visible");
        isVisible = false;
        // Remove element along with its children if they are display none or visibility hidden
        element.querySelectorAll("*").forEach((child) => {
          child.classList.add("pragya-hidden"); // add "pragya-hidden" class to the children of the element
        });
      }

      // if element has class `pragya-hidden` or id `pragya-prompt` or class `pragya-doorhanger-container`, isVisible is false
      // (Remove element along with its children if they have class pragya-hidden or id pragya-prompt or class pragya-doorhanger-container)
      if (element.classList.contains("pragya-hidden") || element.id === "pragya-prompt" || element.classList.contains("pragya-doorhanger-container")) {
        isVisible = false;
      }

      let textualContent = element.textContent.trim().replace(/\s{2,}/g, " "); // Get textual content of the element
      let elementType = element.tagName.toLowerCase();
      let ariaLabel = element.getAttribute("aria-label") || "";
      let placeholder = element.getAttribute("placeholder") || "";
      let altText = element.getAttribute("alt") || "";
      let label = ""; // Initialize label variable
      let clickable = element.tagName === "INPUT" || element.tagName === "TEXTAREA" || element.tagName === "SELECT" || element.tagName === "BUTTON" || element.tagName === "A" || element.onclick != null || window.getComputedStyle(element).cursor == "pointer" || element.tagName === "IMG" || element.tagName === "VIDEO";

      if (!isVisible) {
        textualContent = "";
        ariaLabel = "";
        placeholder = "";
        altText = "";
        label = "";
        clickable = false;
      }

      // Check if the element has a label associated with it
      const labelElement = element.closest("label");
      if (labelElement) {
        label = labelElement.textContent.trim();
      }

      // save xpath of the element
      path = getXPathTo(element);

      return {
        element: element,
        path: path,
        text: textualContent,
        type: elementType,
        ariaLabel: ariaLabel,
        placeholder: placeholder,
        label: label,
        altText: altText,
        clickable: clickable,
      };
    });


  items = items.filter(
    (x) => !items.some((y) => x.element.contains(y.element) && !(x == y)) // Only keep inner items
  );

  // Only keep singular divs, spans, p, h1, h2, h3, h4, h5, h6, input, textarea, select, button, a, img, video, that has no children
  items = items.filter(
    (item) => item.type === "div" || item.type === "span" || item.type === "p" || item.type === "h1" || item.type === "h2" || item.type === "h3" || item.type === "h4" || item.type === "h5" || item.type === "h6" || item.type === "input" || item.type === "textarea" || item.type === "select" || item.type === "button" || item.type === "a" || item.type === "img" || item.type === "video" && item.element.children.length === 0
  )

  // Only keep items that have textual content or alt text or label or placeholder or aria-label
  items = items.filter(
    (item) => item.text || item.altText || item.label || item.placeholder || item.ariaLabel
  )

  // Only keep textual content that have words len more than 10 if they are not clickable
  items = items.filter(
    (item) => item.text.split(" ").length > 10 || item.clickable
  )

  // remove empty key value pairs
  items = items.filter(
    (item) => Object.keys(item).length !== 0
  )

  items.forEach((item, index) => {
    item.id = index;
  });

  const elements = getElementsTree(items);

  // console.log(elements);

  return elements;
}

async function getCurrentElements() {
  let trail = 4;
  let elements = [];
  async function wait() {
    return new Promise(resolve => setTimeout(resolve, 2000)); // Default wait time is 2 seconds
  }

  while (trail > 0) {
    // markPage();
    elements = getClickableAndTextualContent();
    if (elements.length > 0) {
      break;
    }
    trail--;
    await wait();
  }

  // convert json to string, replace ' with " like 'key'->"key" but not 's, it will be 's, then parse it to json
  // elements = JSON.parse(JSON.stringify(elements).replace(/'/g, '"'));
  elements = JSON.parse(JSON.stringify(elements));
  elements_string = JSON.stringify(elements);

  console.log(elements_string);
  return elements;
}


// getClickableAndTextualContent(); will be called only if the whole page is loaded
window.addEventListener("load", getCurrentElements);