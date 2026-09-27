const API_URL = "https://kirubot.xyz";

async function updateStatus() {
    try {
        const response = await fetch(
            `${API_URL}?t=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const data = await response.json();

        console.log("KIRU STATUS:", data);

        const servers =
            data.servers ?? 0;

        const members =
            data.members ?? 0;

        const commands =
            data.commands ?? 29;

        const clusters =
            data.clusters ?? 1;

        const shards =
            data.shards ?? 1;

        const ping =
            data.ping ?? data.latency ?? null;

        const uptime =
            data.uptimeText ?? "—";

        const online =
            data.status === "online";


        // Main status

        setText(
            "bot-status",
            online ? "ONLINE" : "OFFLINE"
        );

        setText(
            "status-message",
            online
                ? "KIRU is connected to Discord."
                : "KIRU is offline."
        );


        // Stats

        setText(
            "ping",
            ping !== null
                ? `${ping}ms`
                : "—"
        );

        setText(
            "latency",
            ping !== null
                ? `${ping}ms`
                : "—"
        );

        setText(
            "uptime",
            uptime
        );

        setText(
            "servers",
            Number(servers).toLocaleString()
        );

        setText(
            "members",
            Number(members).toLocaleString()
        );

        setText(
            "commands",
            Number(commands).toLocaleString()
        );


        // Infrastructure

        setText(
            "clusters",
            Number(clusters).toLocaleString()
        );

        setText(
            "shards",
            Number(shards).toLocaleString()
        );

        setText(
            "servers-per-shard",
            Number(
                data.serversPerShard ?? 0
            ).toLocaleString()
        );

        setText(
            "members-per-shard",
            Number(
                data.membersPerShard ?? 0
            ).toLocaleString()
        );


        // Hero

        setText(
            "hero-ping",
            ping !== null
                ? `${ping}ms`
                : "—"
        );

        setText(
            "hero-servers",
            Number(servers).toLocaleString()
        );

        setText(
            "hero-uptime",
            uptime
        );

        setText(
            "hero-shards",
            Number(shards).toLocaleString()
        );


        // Health

        setText(
            "discord-health",
            online
                ? "Operational"
                : "Offline"
        );

        setText(
            "api-health",
            "Operational"
        );


        // Updated time

        setText(
            "last-updated",
            new Date().toLocaleTimeString()
        );


        // Shards

        renderShards(
            data.shardData
        );

    } catch (error) {

        console.error(
            "KIRU API ERROR:",
            error
        );

        setText(
            "bot-status",
            "API ERROR"
        );

        setText(
            "status-message",
            "Unable to connect to KIRU."
        );

        setText(
            "servers",
            "—"
        );

    }
}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}


function renderShards(shards) {

    const container =
        document.getElementById(
            "shards-container"
        );

    if (!container) return;

    if (!Array.isArray(shards)) {

        container.innerHTML = `
            <div class="loading-card">
                Shard information unavailable.
            </div>
        `;

        return;
    }

    container.innerHTML =
        shards.map(shard => {

            return `
                <article class="shard-card">

                    <div class="shard-top">

                        <div class="shard-name">
                            Shard ${shard.id}
                        </div>

                        <span class="shard-status">
                            ONLINE
                        </span>

                    </div>

                    <div class="shard-stats">

                        <div class="shard-stat">
                            <span>Ping</span>
                            <strong>
                                ${shard.ping}ms
                            </strong>
                        </div>

                        <div class="shard-stat">
                            <span>Servers</span>
                            <strong>
                                ${shard.servers ?? "—"}
                            </strong>
                        </div>

                        <div class="shard-stat">
                            <span>Members</span>
                            <strong>
                                ${shard.members ?? "—"}
                            </strong>
                        </div>

                    </div>

                </article>
            `;

        }).join("");
}


// Initial load

updateStatus();


// Update every 30 seconds

setInterval(
    updateStatus,
    30000
);


// Refresh when returning to the tab

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {
            updateStatus();
        }

    }
);
