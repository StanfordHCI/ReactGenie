"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.displayResult = displayResult;
exports.executeGenieCode = executeGenieCode;
exports.useGenieSelector = exports.useGenieCodeSelector = exports.uiActive = void 0;
var _modalityProvider = require("./modality-provider");
var _reactDecorators = require("./react-decorators");
var _reactRedux = require("react-redux");
var _reactgenieDsl = require("reactgenie-dsl");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
let uiActive = true;
exports.uiActive = uiActive;
const useGenieCodeSelector = command => {
  return state => {
    exports.uiActive = uiActive = false;
    console.log(`before executing state ${JSON.stringify(state)}`);
    (0, _reactgenieDsl.setSharedState)(state);
    const result = _modalityProvider.GenieInterpreter.dslInterpreter.interpret(command);
    console.log(`executed result ${result}`);
    console.log(`after executing state ${JSON.stringify(state)}`);
    exports.uiActive = uiActive = true;
    return result;
  };
};
exports.useGenieCodeSelector = useGenieCodeSelector;
const shallowEqualWithArray = (left, right) => {
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return false;
    }
    for (let i = 0; i < left.length; i++) {
      if (!shallowEqualWithArray(left[i], right[i])) {
        return false;
      }
    }
    return true;
  } else {
    return (0, _reactRedux.shallowEqual)(left, right);
  }
};
const convertGenieClassToState = obj => {
  if (Array.isArray(obj)) {
    return obj.map(element => convertGenieClassToState(element));
  } else if (obj === null || obj === undefined || obj.constructor === undefined) {
    return obj;
  } else if (obj.constructor.prototype instanceof _reactgenieDsl.GenieObject) {
    if (obj.constructor.prototype instanceof _reactgenieDsl.DataClass) {
      return _objectSpread({
        __genieObjectType: "DataClass",
        __genieObjectClass: obj.constructor.name,
        __genieObjectKey: obj[obj.genieKey]
      }, obj.__getState());
    } else if (obj.constructor.prototype instanceof _reactgenieDsl.HelperClass) {
      return _objectSpread({
        __genieObjectType: "HelperClass",
        __genieObjectClass: obj.constructor.name
      }, obj.localStore);
    }
    throw new Error("Unknown GenieObject type");
  } else {
    return obj;
  }
};
const useGenieSelector = selector => {
  let selectorResult = undefined;
  (0, _reactRedux.useSelector)(state => {
    (0, _reactgenieDsl.setSharedState)(state);
    selectorResult = selector(state);
    return convertGenieClassToState(selectorResult);
  }, shallowEqualWithArray);
  return selectorResult;
};
exports.useGenieSelector = useGenieSelector;
function jsonifyResult(result) {
  let resultStr;
  if (result.type === "object") {
    if (result.objectType === "string" || result.objectType === "int" || result.objectType === "boolean" || result.objectType === "float") {
      resultStr = {
        value: result.value
      };
    } else if (result.objectType === "void") {
      resultStr = {
        result: "done"
      };
    } else {
      resultStr = result.value.description();
    }
  } else if (result.type === "array") {
    resultStr = result.value.map(element => jsonifyResult(element));
  }
  return resultStr;
}
function stringifyResult(result) {
  return JSON.stringify(jsonifyResult(result));
}
function executeGenieCode(command) {
  return (0, _reactgenieDsl.genieDispatch)(() => {
    console.log(`before executing state ${JSON.stringify(_reactgenieDsl.sharedState)}`);
    try {
      const result = _modalityProvider.GenieInterpreter.dslInterpreter.interpretSteps(command);
      return {
        success: true,
        results: result
      };
    } catch (e) {
      const reactGenieState = _reactgenieDsl.sharedState;
      reactGenieState.message = {
        message: "Sorry, I don't understand...",
        type: "error"
      };
      return {
        success: false,
        results: [e]
      };
    }
  });
}
function displayResult(executionResult, transcript, parsed, genieInterfaces) {
  (0, _reactgenieDsl.genieDispatch)(() => {
    let allDisplayingObjects = [];
    let displayingObject = null;
    let displayingObjectType = "";
    const result = executionResult.results;
    let lastResult = true;
    for (let i = result.length - 1; i >= 0; i--) {
      if (i != result.length - 1) {
        lastResult = false;
      }
      const step = result[i];
      allDisplayingObjects = [];
      console.log(`last executed step ${JSON.stringify(step)}`);
      const stepResult = step.result;
      if (stepResult.type === "object") {
        allDisplayingObjects.push(stepResult);
      } else if (stepResult.type === "array") {
        for (const element of stepResult.value) {
          allDisplayingObjects.push(element);
        }
      }
      // check if object can be displayed
      if (allDisplayingObjects.length === 1) {
        displayingObjectType = allDisplayingObjects[0].objectType;
        displayingObject = allDisplayingObjects[0];
      } else if (allDisplayingObjects.length > 1) {
        displayingObjectType = allDisplayingObjects[0].objectType + "[]";
        displayingObject = allDisplayingObjects;
      } else if (allDisplayingObjects.length === 0) {
        displayingObjectType = "undefined";
        displayingObject = null;
      }
      // if displayingObjectType in the keys of AllGenieObjectInterfaces
      if (_reactDecorators.AllGenieObjectInterfaces.supportedTypes.has(displayingObjectType)) {
        break;
      }
    }
    let cannotdisplay = false;
    let onScreen = true;
    let instantiatedDisplayingObject = null;
    if (displayingObject != null) {
      // if displayingObject is an array
      if (displayingObject instanceof Array) {
        // always display
        onScreen = false;
        instantiatedDisplayingObject = [];
        for (const element of displayingObject) {
          const Instance = (0, _reactDecorators.InstantiateGenieObject)({
            className: element.objectType,
            key: element.value
          });
          if (Instance === undefined) {
            cannotdisplay = true;
            break;
          }
          instantiatedDisplayingObject.push(Instance);
        }
      } else {
        const Instance = (0, _reactDecorators.InstantiateGenieObject)({
          className: displayingObject.objectType,
          key: displayingObject.value
        });
        if (Instance === undefined) cannotdisplay = true;else {
          if (lastResult) {
            // always display
            onScreen = false;
          } else {
            // check if displayingObjects is on screen already
            const targetInterface = genieInterfaces.find(genieInterface => genieInterface.className === Instance.constructor.name && (0, _reactRedux.shallowEqual)(genieInterface.key, Instance._getConstructorParams()));
            if (!targetInterface) {
              onScreen = false;
            }
          }
          instantiatedDisplayingObject = Instance;
        }
      }
    }
    _modalityProvider.GenieInterpreter.nlParser.respond(transcript, parsed, stringifyResult(
    // now we only display the last result
    executionResult.results[executionResult.results.length - 1].result)).then(result => {
      console.log(`respond result: ${result}`);
      (0, _reactgenieDsl.genieDispatch)(() => {
        if (result !== null) {
          const reactGenieState = _reactgenieDsl.sharedState;
          reactGenieState.message = {
            message: result,
            type: "info"
          };
        }
        if (!onScreen && !cannotdisplay) {
          const reactGenieState = _reactgenieDsl.sharedState;
          reactGenieState.navState = {
            objectViewClassName: _reactDecorators.AllGenieObjectInterfaces.getInterfaces(instantiatedDisplayingObject).viewClassName,
            objectConstructorParams: allDisplayingObjects.length === 1 ? allDisplayingObjects[0].value._getConstructorParams() : {
              elements: allDisplayingObjects.map(displayingObject => displayingObject.value._getConstructorParams())
            }
          };
          reactGenieState.navStack += 1;
        }
      });
    });
    console.log(`after executing state ${JSON.stringify(_reactgenieDsl.sharedState)}`);
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbW9kYWxpdHlQcm92aWRlciIsInJlcXVpcmUiLCJfcmVhY3REZWNvcmF0b3JzIiwiX3JlYWN0UmVkdXgiLCJfcmVhY3RnZW5pZURzbCIsIm93bktleXMiLCJvYmplY3QiLCJlbnVtZXJhYmxlT25seSIsImtleXMiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJzeW1ib2xzIiwiZmlsdGVyIiwic3ltIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZW51bWVyYWJsZSIsInB1c2giLCJhcHBseSIsIl9vYmplY3RTcHJlYWQiLCJ0YXJnZXQiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwic291cmNlIiwiZm9yRWFjaCIsImtleSIsIl9kZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiZGVmaW5lUHJvcGVydHkiLCJvYmoiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJjYWxsIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwidWlBY3RpdmUiLCJleHBvcnRzIiwidXNlR2VuaWVDb2RlU2VsZWN0b3IiLCJjb21tYW5kIiwic3RhdGUiLCJjb25zb2xlIiwibG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsInNldFNoYXJlZFN0YXRlIiwicmVzdWx0IiwiR2VuaWVJbnRlcnByZXRlciIsImRzbEludGVycHJldGVyIiwiaW50ZXJwcmV0Iiwic2hhbGxvd0VxdWFsV2l0aEFycmF5IiwibGVmdCIsInJpZ2h0IiwiQXJyYXkiLCJpc0FycmF5Iiwic2hhbGxvd0VxdWFsIiwiY29udmVydEdlbmllQ2xhc3NUb1N0YXRlIiwibWFwIiwiZWxlbWVudCIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiR2VuaWVPYmplY3QiLCJEYXRhQ2xhc3MiLCJfX2dlbmllT2JqZWN0VHlwZSIsIl9fZ2VuaWVPYmplY3RDbGFzcyIsIm5hbWUiLCJfX2dlbmllT2JqZWN0S2V5IiwiZ2VuaWVLZXkiLCJfX2dldFN0YXRlIiwiSGVscGVyQ2xhc3MiLCJsb2NhbFN0b3JlIiwiRXJyb3IiLCJ1c2VHZW5pZVNlbGVjdG9yIiwic2VsZWN0b3IiLCJzZWxlY3RvclJlc3VsdCIsInVzZVNlbGVjdG9yIiwianNvbmlmeVJlc3VsdCIsInJlc3VsdFN0ciIsInR5cGUiLCJvYmplY3RUeXBlIiwiZGVzY3JpcHRpb24iLCJzdHJpbmdpZnlSZXN1bHQiLCJleGVjdXRlR2VuaWVDb2RlIiwiZ2VuaWVEaXNwYXRjaCIsInNoYXJlZFN0YXRlIiwiaW50ZXJwcmV0U3RlcHMiLCJzdWNjZXNzIiwicmVzdWx0cyIsImUiLCJyZWFjdEdlbmllU3RhdGUiLCJtZXNzYWdlIiwiZGlzcGxheVJlc3VsdCIsImV4ZWN1dGlvblJlc3VsdCIsInRyYW5zY3JpcHQiLCJwYXJzZWQiLCJnZW5pZUludGVyZmFjZXMiLCJhbGxEaXNwbGF5aW5nT2JqZWN0cyIsImRpc3BsYXlpbmdPYmplY3QiLCJkaXNwbGF5aW5nT2JqZWN0VHlwZSIsImxhc3RSZXN1bHQiLCJzdGVwIiwic3RlcFJlc3VsdCIsIkFsbEdlbmllT2JqZWN0SW50ZXJmYWNlcyIsInN1cHBvcnRlZFR5cGVzIiwiaGFzIiwiY2Fubm90ZGlzcGxheSIsIm9uU2NyZWVuIiwiaW5zdGFudGlhdGVkRGlzcGxheWluZ09iamVjdCIsIkluc3RhbmNlIiwiSW5zdGFudGlhdGVHZW5pZU9iamVjdCIsImNsYXNzTmFtZSIsInRhcmdldEludGVyZmFjZSIsImZpbmQiLCJnZW5pZUludGVyZmFjZSIsIl9nZXRDb25zdHJ1Y3RvclBhcmFtcyIsIm5sUGFyc2VyIiwicmVzcG9uZCIsInRoZW4iLCJuYXZTdGF0ZSIsIm9iamVjdFZpZXdDbGFzc05hbWUiLCJnZXRJbnRlcmZhY2VzIiwidmlld0NsYXNzTmFtZSIsIm9iamVjdENvbnN0cnVjdG9yUGFyYW1zIiwiZWxlbWVudHMiLCJuYXZTdGFjayJdLCJzb3VyY2VzIjpbIi4uL3NyYy9zaGFyZWQtc3RvcmUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR2VuaWVJbnRlcnByZXRlciB9IGZyb20gXCIuL21vZGFsaXR5LXByb3ZpZGVyXCI7XG5pbXBvcnQge1xuICBBbGxHZW5pZU9iamVjdEludGVyZmFjZXMsXG4gIEdlbmllSW50ZXJmYWNlU3BlYyxcbiAgSW5zdGFudGlhdGVHZW5pZU9iamVjdCxcbn0gZnJvbSBcIi4vcmVhY3QtZGVjb3JhdG9yc1wiO1xuaW1wb3J0IHsgc2hhbGxvd0VxdWFsLCB1c2VTZWxlY3RvciB9IGZyb20gXCJyZWFjdC1yZWR1eFwiO1xuaW1wb3J0IHtcbiAgRGF0YUNsYXNzLFxuICBHZW5pZU9iamVjdCxcbiAgSGVscGVyQ2xhc3MsXG4gIHNldFNoYXJlZFN0YXRlLFxufSBmcm9tIFwicmVhY3RnZW5pZS1kc2xcIjtcbmltcG9ydCB7IGdlbmllRGlzcGF0Y2gsIHNoYXJlZFN0YXRlIH0gZnJvbSBcInJlYWN0Z2VuaWUtZHNsXCI7XG5cbmV4cG9ydCB0eXBlIFJlYWN0R2VuaWVTdGF0ZSA9IHtcbiAgbWVzc2FnZToge1xuICAgIG1lc3NhZ2U6IHN0cmluZztcbiAgICB0eXBlOiBzdHJpbmc7XG4gIH07XG4gIG5hdlN0YXRlOiBOYXZpZ2F0b3JTdGF0ZTtcbiAgbmF2U3RhY2s6IG51bWJlcjtcbn07XG5cbmV4cG9ydCBsZXQgdWlBY3RpdmUgPSB0cnVlO1xuXG5leHBvcnQgaW50ZXJmYWNlIE5hdmlnYXRvclN0YXRlIHtcbiAgb2JqZWN0Vmlld0NsYXNzTmFtZTogc3RyaW5nIHwgbnVsbDtcbiAgb2JqZWN0Q29uc3RydWN0b3JQYXJhbXM6IGFueTtcbn1cblxuZXhwb3J0IGNvbnN0IHVzZUdlbmllQ29kZVNlbGVjdG9yID0gKGNvbW1hbmQ6IHN0cmluZykgPT4ge1xuICByZXR1cm4gKHN0YXRlOiBhbnkpID0+IHtcbiAgICB1aUFjdGl2ZSA9IGZhbHNlO1xuICAgIGNvbnNvbGUubG9nKGBiZWZvcmUgZXhlY3V0aW5nIHN0YXRlICR7SlNPTi5zdHJpbmdpZnkoc3RhdGUpfWApO1xuICAgIHNldFNoYXJlZFN0YXRlKHN0YXRlKTtcbiAgICBjb25zdCByZXN1bHQgPSBHZW5pZUludGVycHJldGVyLmRzbEludGVycHJldGVyLmludGVycHJldChjb21tYW5kKTtcbiAgICBjb25zb2xlLmxvZyhgZXhlY3V0ZWQgcmVzdWx0ICR7cmVzdWx0fWApO1xuICAgIGNvbnNvbGUubG9nKGBhZnRlciBleGVjdXRpbmcgc3RhdGUgJHtKU09OLnN0cmluZ2lmeShzdGF0ZSl9YCk7XG4gICAgdWlBY3RpdmUgPSB0cnVlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59O1xuXG5jb25zdCBzaGFsbG93RXF1YWxXaXRoQXJyYXkgPSAobGVmdDogYW55LCByaWdodDogYW55KSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KGxlZnQpICYmIEFycmF5LmlzQXJyYXkocmlnaHQpKSB7XG4gICAgaWYgKGxlZnQubGVuZ3RoICE9PSByaWdodC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZWZ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIXNoYWxsb3dFcXVhbFdpdGhBcnJheShsZWZ0W2ldLCByaWdodFtpXSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc2hhbGxvd0VxdWFsKGxlZnQsIHJpZ2h0KTtcbiAgfVxufTtcblxuY29uc3QgY29udmVydEdlbmllQ2xhc3NUb1N0YXRlID0gKG9iajogYW55KSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICByZXR1cm4gb2JqLm1hcCgoZWxlbWVudCkgPT4gY29udmVydEdlbmllQ2xhc3NUb1N0YXRlKGVsZW1lbnQpKTtcbiAgfSBlbHNlIGlmIChcbiAgICBvYmogPT09IG51bGwgfHxcbiAgICBvYmogPT09IHVuZGVmaW5lZCB8fFxuICAgIG9iai5jb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkXG4gICkge1xuICAgIHJldHVybiBvYmo7XG4gIH0gZWxzZSBpZiAob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmllT2JqZWN0KSB7XG4gICAgaWYgKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgaW5zdGFuY2VvZiBEYXRhQ2xhc3MpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9fZ2VuaWVPYmplY3RUeXBlOiBcIkRhdGFDbGFzc1wiLFxuICAgICAgICBfX2dlbmllT2JqZWN0Q2xhc3M6IG9iai5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgICAgICBfX2dlbmllT2JqZWN0S2V5OiBvYmpbb2JqLmdlbmllS2V5XSxcbiAgICAgICAgLi4ub2JqLl9fZ2V0U3RhdGUoKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChvYmouY29uc3RydWN0b3IucHJvdG90eXBlIGluc3RhbmNlb2YgSGVscGVyQ2xhc3MpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9fZ2VuaWVPYmplY3RUeXBlOiBcIkhlbHBlckNsYXNzXCIsXG4gICAgICAgIF9fZ2VuaWVPYmplY3RDbGFzczogb2JqLmNvbnN0cnVjdG9yLm5hbWUsXG4gICAgICAgIC4uLm9iai5sb2NhbFN0b3JlLFxuICAgICAgfTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBHZW5pZU9iamVjdCB0eXBlXCIpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBvYmo7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCB1c2VHZW5pZVNlbGVjdG9yID0gKHNlbGVjdG9yOiBhbnkpID0+IHtcbiAgbGV0IHNlbGVjdG9yUmVzdWx0OiBhbnkgPSB1bmRlZmluZWQ7XG4gIHVzZVNlbGVjdG9yKChzdGF0ZTogYW55KSA9PiB7XG4gICAgc2V0U2hhcmVkU3RhdGUoc3RhdGUpO1xuICAgIHNlbGVjdG9yUmVzdWx0ID0gc2VsZWN0b3Ioc3RhdGUpO1xuICAgIHJldHVybiBjb252ZXJ0R2VuaWVDbGFzc1RvU3RhdGUoc2VsZWN0b3JSZXN1bHQpO1xuICB9LCBzaGFsbG93RXF1YWxXaXRoQXJyYXkpO1xuICByZXR1cm4gc2VsZWN0b3JSZXN1bHQ7XG59O1xuXG50eXBlIEdlbmllQ29kZVJlc3VsdCA9IHtcbiAgc3VjY2VzczogYm9vbGVhbjtcbiAgcmVzdWx0czogW3sgYXN0OiBhbnk7IHJlc3VsdDogYW55IH1dO1xufTtcblxuZnVuY3Rpb24ganNvbmlmeVJlc3VsdChyZXN1bHQ6IGFueSkge1xuICBsZXQgcmVzdWx0U3RyO1xuICBpZiAocmVzdWx0LnR5cGUgPT09IFwib2JqZWN0XCIpIHtcbiAgICBpZiAoXG4gICAgICByZXN1bHQub2JqZWN0VHlwZSA9PT0gXCJzdHJpbmdcIiB8fFxuICAgICAgcmVzdWx0Lm9iamVjdFR5cGUgPT09IFwiaW50XCIgfHxcbiAgICAgIHJlc3VsdC5vYmplY3RUeXBlID09PSBcImJvb2xlYW5cIiB8fFxuICAgICAgcmVzdWx0Lm9iamVjdFR5cGUgPT09IFwiZmxvYXRcIlxuICAgICkge1xuICAgICAgcmVzdWx0U3RyID0geyB2YWx1ZTogcmVzdWx0LnZhbHVlIH07XG4gICAgfSBlbHNlIGlmIChyZXN1bHQub2JqZWN0VHlwZSA9PT0gXCJ2b2lkXCIpIHtcbiAgICAgIHJlc3VsdFN0ciA9IHsgcmVzdWx0OiBcImRvbmVcIiB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHRTdHIgPSByZXN1bHQudmFsdWUuZGVzY3JpcHRpb24oKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAocmVzdWx0LnR5cGUgPT09IFwiYXJyYXlcIikge1xuICAgIHJlc3VsdFN0ciA9IHJlc3VsdC52YWx1ZS5tYXAoKGVsZW1lbnQpID0+IGpzb25pZnlSZXN1bHQoZWxlbWVudCkpO1xuICB9XG4gIHJldHVybiByZXN1bHRTdHI7XG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVJlc3VsdChyZXN1bHQ6IGFueSkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoanNvbmlmeVJlc3VsdChyZXN1bHQpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGVHZW5pZUNvZGUoY29tbWFuZDogc3RyaW5nKTogR2VuaWVDb2RlUmVzdWx0IHtcbiAgcmV0dXJuIGdlbmllRGlzcGF0Y2goKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKGBiZWZvcmUgZXhlY3V0aW5nIHN0YXRlICR7SlNPTi5zdHJpbmdpZnkoc2hhcmVkU3RhdGUpfWApO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBHZW5pZUludGVycHJldGVyLmRzbEludGVycHJldGVyLmludGVycHJldFN0ZXBzKGNvbW1hbmQpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgcmVzdWx0czogcmVzdWx0LFxuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zdCByZWFjdEdlbmllU3RhdGUgPSBzaGFyZWRTdGF0ZSBhcyBSZWFjdEdlbmllU3RhdGU7XG4gICAgICByZWFjdEdlbmllU3RhdGUubWVzc2FnZSA9IHtcbiAgICAgICAgbWVzc2FnZTogXCJTb3JyeSwgSSBkb24ndCB1bmRlcnN0YW5kLi4uXCIsXG4gICAgICAgIHR5cGU6IFwiZXJyb3JcIixcbiAgICAgIH07XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgcmVzdWx0czogW2VdLFxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGxheVJlc3VsdChcbiAgZXhlY3V0aW9uUmVzdWx0OiBHZW5pZUNvZGVSZXN1bHQsXG4gIHRyYW5zY3JpcHQ6IHN0cmluZyxcbiAgcGFyc2VkOiBzdHJpbmcsXG4gIGdlbmllSW50ZXJmYWNlczogR2VuaWVJbnRlcmZhY2VTcGVjW11cbikge1xuICBnZW5pZURpc3BhdGNoKCgpID0+IHtcbiAgICBsZXQgYWxsRGlzcGxheWluZ09iamVjdHMgPSBbXTtcbiAgICBsZXQgZGlzcGxheWluZ09iamVjdCA9IG51bGw7XG4gICAgbGV0IGRpc3BsYXlpbmdPYmplY3RUeXBlID0gXCJcIjtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGV4ZWN1dGlvblJlc3VsdC5yZXN1bHRzO1xuICAgIGxldCBsYXN0UmVzdWx0ID0gdHJ1ZTtcblxuICAgIGZvciAobGV0IGkgPSByZXN1bHQubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGlmIChpICE9IHJlc3VsdC5sZW5ndGggLSAxKSB7XG4gICAgICAgIGxhc3RSZXN1bHQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHN0ZXAgPSByZXN1bHRbaV07XG4gICAgICBhbGxEaXNwbGF5aW5nT2JqZWN0cyA9IFtdO1xuICAgICAgY29uc29sZS5sb2coYGxhc3QgZXhlY3V0ZWQgc3RlcCAke0pTT04uc3RyaW5naWZ5KHN0ZXApfWApO1xuICAgICAgY29uc3Qgc3RlcFJlc3VsdCA9IHN0ZXAucmVzdWx0O1xuICAgICAgaWYgKHN0ZXBSZXN1bHQudHlwZSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBhbGxEaXNwbGF5aW5nT2JqZWN0cy5wdXNoKHN0ZXBSZXN1bHQpO1xuICAgICAgfSBlbHNlIGlmIChzdGVwUmVzdWx0LnR5cGUgPT09IFwiYXJyYXlcIikge1xuICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2Ygc3RlcFJlc3VsdC52YWx1ZSkge1xuICAgICAgICAgIGFsbERpc3BsYXlpbmdPYmplY3RzLnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGNoZWNrIGlmIG9iamVjdCBjYW4gYmUgZGlzcGxheWVkXG4gICAgICBpZiAoYWxsRGlzcGxheWluZ09iamVjdHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGRpc3BsYXlpbmdPYmplY3RUeXBlID0gYWxsRGlzcGxheWluZ09iamVjdHNbMF0ub2JqZWN0VHlwZTtcbiAgICAgICAgZGlzcGxheWluZ09iamVjdCA9IGFsbERpc3BsYXlpbmdPYmplY3RzWzBdO1xuICAgICAgfSBlbHNlIGlmIChhbGxEaXNwbGF5aW5nT2JqZWN0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGRpc3BsYXlpbmdPYmplY3RUeXBlID0gYWxsRGlzcGxheWluZ09iamVjdHNbMF0ub2JqZWN0VHlwZSArIFwiW11cIjtcbiAgICAgICAgZGlzcGxheWluZ09iamVjdCA9IGFsbERpc3BsYXlpbmdPYmplY3RzO1xuICAgICAgfSBlbHNlIGlmIChhbGxEaXNwbGF5aW5nT2JqZWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGlzcGxheWluZ09iamVjdFR5cGUgPSBcInVuZGVmaW5lZFwiO1xuICAgICAgICBkaXNwbGF5aW5nT2JqZWN0ID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIC8vIGlmIGRpc3BsYXlpbmdPYmplY3RUeXBlIGluIHRoZSBrZXlzIG9mIEFsbEdlbmllT2JqZWN0SW50ZXJmYWNlc1xuICAgICAgaWYgKEFsbEdlbmllT2JqZWN0SW50ZXJmYWNlcy5zdXBwb3J0ZWRUeXBlcy5oYXMoZGlzcGxheWluZ09iamVjdFR5cGUpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgY2Fubm90ZGlzcGxheSA9IGZhbHNlO1xuICAgIGxldCBvblNjcmVlbiA9IHRydWU7XG4gICAgbGV0IGluc3RhbnRpYXRlZERpc3BsYXlpbmdPYmplY3QgPSBudWxsO1xuICAgIGlmIChkaXNwbGF5aW5nT2JqZWN0ICE9IG51bGwpIHtcbiAgICAgIC8vIGlmIGRpc3BsYXlpbmdPYmplY3QgaXMgYW4gYXJyYXlcbiAgICAgIGlmIChkaXNwbGF5aW5nT2JqZWN0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgLy8gYWx3YXlzIGRpc3BsYXlcbiAgICAgICAgb25TY3JlZW4gPSBmYWxzZTtcbiAgICAgICAgaW5zdGFudGlhdGVkRGlzcGxheWluZ09iamVjdCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgZGlzcGxheWluZ09iamVjdCkge1xuICAgICAgICAgIGNvbnN0IEluc3RhbmNlID0gSW5zdGFudGlhdGVHZW5pZU9iamVjdCh7XG4gICAgICAgICAgICBjbGFzc05hbWU6IGVsZW1lbnQub2JqZWN0VHlwZSxcbiAgICAgICAgICAgIGtleTogZWxlbWVudC52YWx1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAoSW5zdGFuY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2Fubm90ZGlzcGxheSA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5zdGFudGlhdGVkRGlzcGxheWluZ09iamVjdC5wdXNoKEluc3RhbmNlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgSW5zdGFuY2UgPSBJbnN0YW50aWF0ZUdlbmllT2JqZWN0KHtcbiAgICAgICAgICBjbGFzc05hbWU6IGRpc3BsYXlpbmdPYmplY3Qub2JqZWN0VHlwZSxcbiAgICAgICAgICBrZXk6IGRpc3BsYXlpbmdPYmplY3QudmFsdWUsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoSW5zdGFuY2UgPT09IHVuZGVmaW5lZCkgY2Fubm90ZGlzcGxheSA9IHRydWU7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChsYXN0UmVzdWx0KSB7XG4gICAgICAgICAgICAvLyBhbHdheXMgZGlzcGxheVxuICAgICAgICAgICAgb25TY3JlZW4gPSBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgZGlzcGxheWluZ09iamVjdHMgaXMgb24gc2NyZWVuIGFscmVhZHlcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldEludGVyZmFjZSA9IGdlbmllSW50ZXJmYWNlcy5maW5kKFxuICAgICAgICAgICAgICAoZ2VuaWVJbnRlcmZhY2UpID0+XG4gICAgICAgICAgICAgICAgZ2VuaWVJbnRlcmZhY2UuY2xhc3NOYW1lID09PSBJbnN0YW5jZS5jb25zdHJ1Y3Rvci5uYW1lICYmXG4gICAgICAgICAgICAgICAgc2hhbGxvd0VxdWFsKFxuICAgICAgICAgICAgICAgICAgZ2VuaWVJbnRlcmZhY2Uua2V5LFxuICAgICAgICAgICAgICAgICAgSW5zdGFuY2UuX2dldENvbnN0cnVjdG9yUGFyYW1zKClcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKCF0YXJnZXRJbnRlcmZhY2UpIHtcbiAgICAgICAgICAgICAgb25TY3JlZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpbnN0YW50aWF0ZWREaXNwbGF5aW5nT2JqZWN0ID0gSW5zdGFuY2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgR2VuaWVJbnRlcnByZXRlci5ubFBhcnNlclxuICAgICAgLnJlc3BvbmQoXG4gICAgICAgIHRyYW5zY3JpcHQsXG4gICAgICAgIHBhcnNlZCxcbiAgICAgICAgc3RyaW5naWZ5UmVzdWx0KFxuICAgICAgICAgIC8vIG5vdyB3ZSBvbmx5IGRpc3BsYXkgdGhlIGxhc3QgcmVzdWx0XG4gICAgICAgICAgZXhlY3V0aW9uUmVzdWx0LnJlc3VsdHNbZXhlY3V0aW9uUmVzdWx0LnJlc3VsdHMubGVuZ3RoIC0gMV0ucmVzdWx0XG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYHJlc3BvbmQgcmVzdWx0OiAke3Jlc3VsdH1gKTtcbiAgICAgICAgZ2VuaWVEaXNwYXRjaCgoKSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3QgcmVhY3RHZW5pZVN0YXRlID0gc2hhcmVkU3RhdGUgYXMgUmVhY3RHZW5pZVN0YXRlO1xuICAgICAgICAgICAgcmVhY3RHZW5pZVN0YXRlLm1lc3NhZ2UgPSB7XG4gICAgICAgICAgICAgIG1lc3NhZ2U6IHJlc3VsdCxcbiAgICAgICAgICAgICAgdHlwZTogXCJpbmZvXCIsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIW9uU2NyZWVuICYmICFjYW5ub3RkaXNwbGF5KSB7XG4gICAgICAgICAgICBjb25zdCByZWFjdEdlbmllU3RhdGUgPSBzaGFyZWRTdGF0ZSBhcyBSZWFjdEdlbmllU3RhdGU7XG4gICAgICAgICAgICByZWFjdEdlbmllU3RhdGUubmF2U3RhdGUgPSB7XG4gICAgICAgICAgICAgIG9iamVjdFZpZXdDbGFzc05hbWU6IEFsbEdlbmllT2JqZWN0SW50ZXJmYWNlcy5nZXRJbnRlcmZhY2VzKFxuICAgICAgICAgICAgICAgIGluc3RhbnRpYXRlZERpc3BsYXlpbmdPYmplY3RcbiAgICAgICAgICAgICAgKS52aWV3Q2xhc3NOYW1lLFxuICAgICAgICAgICAgICBvYmplY3RDb25zdHJ1Y3RvclBhcmFtczpcbiAgICAgICAgICAgICAgICBhbGxEaXNwbGF5aW5nT2JqZWN0cy5sZW5ndGggPT09IDFcbiAgICAgICAgICAgICAgICAgID8gYWxsRGlzcGxheWluZ09iamVjdHNbMF0udmFsdWUuX2dldENvbnN0cnVjdG9yUGFyYW1zKClcbiAgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzOiBhbGxEaXNwbGF5aW5nT2JqZWN0cy5tYXAoKGRpc3BsYXlpbmdPYmplY3QpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5aW5nT2JqZWN0LnZhbHVlLl9nZXRDb25zdHJ1Y3RvclBhcmFtcygpXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZWFjdEdlbmllU3RhdGUubmF2U3RhY2sgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhgYWZ0ZXIgZXhlY3V0aW5nIHN0YXRlICR7SlNPTi5zdHJpbmdpZnkoc2hhcmVkU3RhdGUpfWApO1xuICB9KTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFBQSxpQkFBQSxHQUFBQyxPQUFBO0FBQ0EsSUFBQUMsZ0JBQUEsR0FBQUQsT0FBQTtBQUtBLElBQUFFLFdBQUEsR0FBQUYsT0FBQTtBQUNBLElBQUFHLGNBQUEsR0FBQUgsT0FBQTtBQUt3QixTQUFBSSxRQUFBQyxNQUFBLEVBQUFDLGNBQUEsUUFBQUMsSUFBQSxHQUFBQyxNQUFBLENBQUFELElBQUEsQ0FBQUYsTUFBQSxPQUFBRyxNQUFBLENBQUFDLHFCQUFBLFFBQUFDLE9BQUEsR0FBQUYsTUFBQSxDQUFBQyxxQkFBQSxDQUFBSixNQUFBLEdBQUFDLGNBQUEsS0FBQUksT0FBQSxHQUFBQSxPQUFBLENBQUFDLE1BQUEsV0FBQUMsR0FBQSxXQUFBSixNQUFBLENBQUFLLHdCQUFBLENBQUFSLE1BQUEsRUFBQU8sR0FBQSxFQUFBRSxVQUFBLE9BQUFQLElBQUEsQ0FBQVEsSUFBQSxDQUFBQyxLQUFBLENBQUFULElBQUEsRUFBQUcsT0FBQSxZQUFBSCxJQUFBO0FBQUEsU0FBQVUsY0FBQUMsTUFBQSxhQUFBQyxDQUFBLE1BQUFBLENBQUEsR0FBQUMsU0FBQSxDQUFBQyxNQUFBLEVBQUFGLENBQUEsVUFBQUcsTUFBQSxXQUFBRixTQUFBLENBQUFELENBQUEsSUFBQUMsU0FBQSxDQUFBRCxDQUFBLFFBQUFBLENBQUEsT0FBQWYsT0FBQSxDQUFBSSxNQUFBLENBQUFjLE1BQUEsT0FBQUMsT0FBQSxXQUFBQyxHQUFBLElBQUFDLGVBQUEsQ0FBQVAsTUFBQSxFQUFBTSxHQUFBLEVBQUFGLE1BQUEsQ0FBQUUsR0FBQSxTQUFBaEIsTUFBQSxDQUFBa0IseUJBQUEsR0FBQWxCLE1BQUEsQ0FBQW1CLGdCQUFBLENBQUFULE1BQUEsRUFBQVYsTUFBQSxDQUFBa0IseUJBQUEsQ0FB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