const format = data => {
  let nodes = [
    {
      title: "root",
      level: 0,
      children: [],
    }
  ]
  let biggestLevel = 0
  for (let i = 0; i < data.length; i++) {
    nodes[i+1] = {
      title: data[i][1],
      level: data[i][0],
      children: [],
    }
   if (data[i][0] > biggestLevel) {
     biggestLevel = data[i][0]
   }
  }

  for (let i = 0; i < data.length+1; i++) {
    if (i != 0 && nodes[i].level > nodes[i-1].level) {
      nodes[i-1].children.push(nodes[i]) 
    } else if (i != 0 && !(nodes[i].level > nodes[i-1].level)) {
      for (let j = nodes.indexOf(nodes[i])-1; j >= 0; j--) {
        if (nodes[j].level < nodes[i].level) {
          nodes[j].children.push(nodes[i])
          break
        }
      }
    }
  }
  console.log(nodes)

  let tree = {}
  tree.root = nodes[0]
  let currentNode = nodes[0]
  let currentNodePath = "children"
  let finalTree = appendChildren(tree, nodes, currentNode, currentNodePath)
  return finalTree
}

const appendChildren = (tree, nodes, currentNode, currentNodePath) => {
  if (currentNodePath != "children") {
    currentNodePath += '["children'
  }
  for (let j = 0; j < currentNode.children.length; j++) {
    if (currentNode.level === 0) {
      tree.root.children[j] = nodes[nodes.indexOf(currentNode)].children[j]
    } else {
      currentNodePathTemp = currentNodePath
      if (currentNodePath !== "children") {
        currentNodePathTemp = currentNodePath + '"]'
      }
      if (tree.root[currentNodePathTemp].children) {
        tree.root.children[currentNodePath + '"]'].children[j] = nodes[nodes.indexOf(currentNode)].children[j]
      }
    }
    if (nodes[nodes.indexOf(currentNode)].children[j].children && nodes[nodes.indexOf(currentNode)].children[j].children.length != 0) {
      currentNodePathTemp = currentNodePath
      if (currentNodePath !== "children") {
        currentNodePathTemp = currentNodePath + '"]'
      }
      if (!tree.root[currentNodePathTemp].children) return tree
      console.log(tree.root, currentNodePathTemp)
      appendChildren(tree, nodes, tree.root[currentNodePathTemp].children[j], currentNodePath)
    }
  }
}

const printData = (data, previousTab=0) => {
  previousTab++
  for (let i = 0; i < previousTab; i++) {
    if (data.title !== "root") {
      process.stdout.write("        ")
    }
  }
  process.stdout.write("{\n")
  for (let i = 0; i < previousTab; i++) {
    process.stdout.write("        ")
  }
  process.stdout.write('"title": ' + data.title + ",\n")
  for (let i = 0; i < previousTab; i++) {
    process.stdout.write("        ")
  }
  process.stdout.write('"level": ' + data.level + ",\n")
  for (let i = 0; i < previousTab; i++) {
    process.stdout.write("        ")
  }
  if (data.children) {
    process.stdout.write('"children": ')
    if (data.children.length === 0) {
      process.stdout.write("[]\n")
    } else {
      process.stdout.write("[\n")
    }
    for (let i = 0; i < data.children.length; i++) {
      printData(data.children[i], previousTab)
      for (let i = 0; i < previousTab+1; i++) {
        process.stdout.write("        ")
      }
      process.stdout.write("},\n")
      if (data.children.length-1 === i) {
        for (let i = 0; i < previousTab; i++) {
          process.stdout.write("        ")
        }
        process.stdout.write("]\n")
      }
    }
  }
  if (data.title === "root") {
    process.stdout.write("}\n")
  }
}
/*
      for (let i = previousTab; i > 0; i--) {
        for (let j = i; j > 0; j--) {
          process.stdout.write("        ")
        }
        process.stdout.write("},\n")
      }
 */

let data1 = [[1, "Main"], [2, "Secondary"], [3, "Tetriary"]]
printData(format(data1).root)
console.log("\n\n\n")

let data2 = [[1, "Main"], [3, "Tetriary in Main"], [2, "Secondary also in Main"]]
printData(format(data2).root)

