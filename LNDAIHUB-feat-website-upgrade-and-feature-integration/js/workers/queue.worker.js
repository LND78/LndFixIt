let queue = [];
let maxWorkers = 4; // Default pool size
let activeWorkers = 0;

self.onmessage = function(e) {
    const { tasks, poolSize } = e.data;
    if (poolSize) {
        maxWorkers = poolSize;
    }
    tasks.forEach(task => queue.push(task));
    processQueue();
};

function processQueue() {
    while (queue.length > 0 && activeWorkers < maxWorkers) {
        const task = queue.shift();
        activeWorkers++;
        // Simulate an async task like a fetch request
        fetch(task.url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            })
            .then(blob => {
                self.postMessage({ status: 'progress', task, blob });
            })
            .catch(error => {
                self.postMessage({ status: 'error', task, error: error.message });
            })
            .finally(() => {
                activeWorkers--;
                processQueue();
            });
    }
    if (queue.length === 0 && activeWorkers === 0) {
        self.postMessage({ status: 'complete' });
    }
}
